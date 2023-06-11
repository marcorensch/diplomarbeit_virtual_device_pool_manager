CREATE TABLE IF NOT EXISTS `devices`
(
    id              int(11)      NOT NULL AUTO_INCREMENT,
    name            varchar(255) NOT NULL,
    image           varchar(255)          DEFAULT NULL,
    notes           text                  DEFAULT NULL,
    hidden          text                  DEFAULT NULL,
    device_type_id  int(11)               DEFAULT NULL,
    same_as         int(11)               DEFAULT NULL,
    imei            text                  DEFAULT NULL,
    params          text         NOT NULL,
    slot_id         int(11)               DEFAULT NULL,
    added           datetime              DEFAULT NOW(),
    manufacturer_id int(11)               DEFAULT NULL,
    checked_out_by  int(11)               DEFAULT NULL,
    checkout_time   datetime              DEFAULT NULL,
    checkout_notes  text                  DEFAULT NULL,
    created_at      datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at     datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT `fk_device_same_as` FOREIGN KEY (same_as) REFERENCES `devices` (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_device_manufacturer` FOREIGN KEY (manufacturer_id) REFERENCES `manufacturers` (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_device_slot` FOREIGN KEY (slot_id) REFERENCES `builder_items` (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_device_type` FOREIGN KEY (device_type_id) REFERENCES `device_types` (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_device_checked_out_by` FOREIGN KEY (checked_out_by) REFERENCES `accounts` (id) ON DELETE SET NULL ON UPDATE CASCADE,
    FULLTEXT (name) -- Volltextsuch-Index auf der Spalte "name"
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;