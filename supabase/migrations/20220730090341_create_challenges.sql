-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.challenge_attempts
(
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid NOT NULL,
    challenge_id bigint NOT NULL,
    attempts smallint NOT NULL DEFAULT '0'::smallint,
    completed boolean NOT NULL DEFAULT false,
    points_scored smallint NOT NULL DEFAULT '0'::smallint,
    CONSTRAINT challenge_attempts_pkey PRIMARY KEY (user_id, challenge_id),
    CONSTRAINT challenge_attempts_challenge_id_fkey FOREIGN KEY (challenge_id)
        REFERENCES public.challenges (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT challenge_attempts_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.challenge_attempts
    OWNER to postgres;

ALTER TABLE IF EXISTS public.challenge_attempts
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.challenge_attempts TO anon;

GRANT ALL ON TABLE public.challenge_attempts TO authenticated;

GRANT ALL ON TABLE public.challenge_attempts TO postgres;

GRANT ALL ON TABLE public.challenge_attempts TO service_role;
CREATE POLICY "Allow write access for service role"
    ON public.challenge_attempts
    AS PERMISSIVE
    FOR INSERT
    TO service_role
    WITH CHECK (true);
CREATE POLICY "Enable read access for authenticated users to own rows"
    ON public.challenge_attempts
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING ((auth.uid() = user_id));

CREATE TABLE IF NOT EXISTS public.challenges
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    created_at timestamp with time zone DEFAULT now(),
    name text COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    flag text COLLATE pg_catalog."default",
    points smallint DEFAULT '0'::smallint,
    CONSTRAINT challenges_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.challenges
    OWNER to postgres;

ALTER TABLE IF EXISTS public.challenges
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.challenges TO anon;

GRANT ALL ON TABLE public.challenges TO authenticated;

GRANT ALL ON TABLE public.challenges TO postgres;

GRANT ALL ON TABLE public.challenges TO service_role;
CREATE POLICY "Enable read access for authenticated users"
    ON public.challenges
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING (true);
