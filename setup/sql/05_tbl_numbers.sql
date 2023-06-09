CREATE TABLE IF NOT EXISTS `numbers`
(
    id          int(11)      NOT NULL AUTO_INCREMENT,
    msisdn      varchar(20)           DEFAULT NULL,
    scn         varchar(20)           DEFAULT NULL,
    abonnement  varchar(255)          DEFAULT NULL,
    sim_number  varchar(255) NOT NULL DEFAULT '',
    parent_id   int(11)               DEFAULT NULL,
    sim_type_id int(11)               DEFAULT NULL,
    notes       text                  DEFAULT NULL,
    hidden      text                  DEFAULT NULL,
    created_at  timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT `numbers_multidevice_link` FOREIGN KEY (parent_id) REFERENCES `numbers` (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `numbers_sim_type_id_link` FOREIGN KEY (sim_type_id) REFERENCES `sim_types` (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `numbers_parent_id_link` FOREIGN KEY (parent_id) REFERENCES `numbers` (id) ON DELETE CASCADE ON UPDATE CASCADE
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;
