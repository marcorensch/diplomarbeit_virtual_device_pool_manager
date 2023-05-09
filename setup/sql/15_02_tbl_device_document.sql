CREATE TABLE IF NOT EXISTS `device_document`
(
    id          int(11) NOT NULL AUTO_INCREMENT,
    device_id   int(11) NOT NULL,
    document_id int(11) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_device_document_device_id FOREIGN KEY (device_id) REFERENCES `devices` (id) ON DELETE CASCADE,
    CONSTRAINT fk_device_document_document_id FOREIGN KEY (document_id) REFERENCES `documents` (id) ON DELETE CASCADE
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;