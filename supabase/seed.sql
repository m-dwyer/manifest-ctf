do $$
begin

-- create challenge files bucket
insert into storage.buckets(
    id,
    name,
    created_at,
    public
) values (
    'challenge_files',
    'challenge_files',
    now(),
    true
);

-- seed categories
insert into public.categories(
    id,
    name
) values (
    nextval('categories_id_seq'),
    'Default'
);

-- seed challenges
for c in 1..50 loop
    insert into public.challenges(
        id,
        created_at,
        name,
        description,
        flag,
        points,
        category
    ) values (
        nextval('challenges_id_seq'),
        now(),
        'Challenge ' || c,
        'Challenge ' || c || ' will require you to think',
        'my_flag' || c,
        (array[10,20,30,40,50])[floor(random() * 5 + 1)],
        1
    );
    end loop;
end;
$$;
