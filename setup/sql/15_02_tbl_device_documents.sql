CREATE TABLE IF NOT EXISTS `device_documents`
(
    id            int(11)      NOT NULL AUTO_INCREMENT,
    device_id     int(11)      NOT NULL,
    document_path varchar(255) NOT NULL,
    document_name varchar(255) NOT NULL,
    sorting       int(11)      NOT NULL DEFAULT 0,
    created_at    timestamp    NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_device_document_device_id FOREIGN KEY (device_id) REFERENCES `devices` (id) ON DELETE CASCADE
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;