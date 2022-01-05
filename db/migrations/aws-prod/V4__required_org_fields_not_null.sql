ALTER TABLE auth.organizations
    ALTER contact_first_name  SET NOT NULL,
    ALTER contact_last_name   SET NOT NULL,
    ALTER contact_email       SET NOT NULL,
    ALTER phone_number        SET NOT NULL,
    ALTER address             SET NOT NULL,
    ALTER country             SET NOT NULL,
    ALTER city                SET NOT NULL,
    ALTER zip_code            SET NOT NULL;
