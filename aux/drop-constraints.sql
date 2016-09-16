alter table nodes drop constraint nodes_ltype_fkey;

alter table triples drop constraint triples_context_fkey;
alter table triples drop constraint triples_creator_fkey;
alter table triples drop constraint triples_subject_fkey;
alter table triples drop constraint triples_predicate_fkey;
alter table triples drop constraint triples_object_fkey;