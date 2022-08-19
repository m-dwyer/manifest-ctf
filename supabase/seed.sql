do $$
begin
-- seed categories
insert into public.categories(
    id,
    created_at,
    name
) values (
    nextval('categories_id_seq'),
    now(),
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
        points
    ) values (
        nextval('challenges_id_seq'),
        now(),
        'Challenge ' || c,
        'Challenge ' || c || ' will require you to think',
        'my_flag' || c,
        (array[10,20,30,40,50])[floor(random() * 5 + 1)]
    );
    end loop;

    -- seed challenge categories
    for c in 1..50 loop
        insert into public.challenge_categories(
            created_at,
            challenge,
            category
        ) values (
            now(),
            c,
            1
        );
    end loop;
end;
$$;
