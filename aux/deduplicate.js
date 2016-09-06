
const async = require('async');
const classer = require('classer');
const h_argv = require('minimist')(process.argv.slice(2));
const pg = require('pg');

const local = classer.logger('deduplicate');

if(!h_argv.d || !h_argv.u || !h_argv.w) {
	console.log(`usage:\n\tnode deduplicate.js -d DATABASE_NAME -u USER -w PASSWORD\n`);
	local.error('check command line arguments for proper usage');
	process.exit(1);
}

const h_config = {
	database: h_argv.d,
	user: h_argv.u,
	password: h_argv.w,
};

let y_client = new pg.Client(h_config);
y_client.connect(function(e_connect) {
	if(e_connect) local.fail('could not connect to ${h_config.database} database: '+e_connect);

	// find geometries with duplicates
	y_client.query(`
		select gvalue from nodes
		where gvalue in (
			select gvalue from nodes group by gvalue having count(*) > 1
		)
	`, (e_select_geoms, h_geoms) => {
		if(e_select_geoms) local.fail(e_select_geoms);

		// debugging
		local.warn(h_geoms.rows.length+' unique geometries have duplicates');

		// each unique geometry
		async.eachSeries(h_geoms.rows, (h_geom, fk_geom) => {

			// fetch all node ids having this geometry
			y_client.query(`select id from nodes where gvalue = $1`, [h_geom.gvalue], (e_select_duplicates, h_duplicates) => {
				if(e_select_duplicates) local.fail(e_select_duplicates);

				// use first id as consolidation node
				let s_root = h_duplicates.rows[0].id;

				// extract duplicates from after beginning of list
				let a_duplicates = h_duplicates.rows.slice(1);

				// each duplicate node
				async.eachSeries(a_duplicates, (h_row, fk_duplicate) => {
					let s_duplicate = h_row.id;

					// update its triples
					y_client.query(`update triples set object = '${s_root}' where object = '${s_duplicate}'`, (e_update) => {
						if(e_update) local.fail(e_update);

						// then delete the duplicate node
						y_client.query(`delete from nodes where id = '${s_duplicate}'`, (e_delete) => {
							if(e_delete) local.fail(e_delete);

							// debugging
							local.info(`${s_duplicate} => ${s_root}`);

							// done with this duplicate
							fk_duplicate();
						});
					});
				}, () => {
					// debugging
					local.good('removed duplicates from geometry: '+h_geom.gvalue.substr(0, 30));

					// done with this geometry literal
					fk_geom();
				});
			});
		}, () => {
			local.info('closing database connection...');

			y_client.end(() => {
				local.good('all done :)');
			});
		});
	});

});
