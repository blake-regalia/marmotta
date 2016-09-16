
alter table nodes add constraint nodes_ltype_fkey foreign key(ltype) references nodes(id);

alter table triples add constraint triples_context_fkey foreign key (context) references nodes(id);
alter table triples add constraint triples_creator_fkey foreign key (creator) references nodes(id);
alter table triples add constraint triples_subject_fkey foreign key (subject) references nodes(id);
alter table triples add constraint triples_predicate_fkey foreign key (predicate) references nodes(id);
alter table triples add constraint triples_object_fkey foreign key (object) references nodes(id);
