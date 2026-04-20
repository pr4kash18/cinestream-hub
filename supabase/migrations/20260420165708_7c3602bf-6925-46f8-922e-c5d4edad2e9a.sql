DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_messages_name_length CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT contact_messages_email_length CHECK (char_length(email) BETWEEN 5 AND 255),
  ADD CONSTRAINT contact_messages_message_length CHECK (char_length(message) BETWEEN 1 AND 2000),
  ADD CONSTRAINT contact_messages_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

CREATE POLICY "Public can submit valid contact messages"
ON public.contact_messages FOR INSERT
WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 5 AND 255
  AND char_length(message) BETWEEN 1 AND 2000
);