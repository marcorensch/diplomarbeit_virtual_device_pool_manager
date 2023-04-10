CREATE TABLE IF NOT EXISTS `numbers`
(
    id         int(11)      NOT NULL AUTO_INCREMENT,
    msisdn     varchar(20)           DEFAULT NULL,
    scn        varchar(20)  NOT NULL,
    abo_type   varchar(255) NOT NULL DEFAULT '',
    sim_number varchar(255) NOT NULL DEFAULT '',
    sim_type   int(11)               DEFAULT NULL,
    parent_id  int(11)               DEFAULT NULL,
    notes      text         NOT NULL,
    hidden     text         NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT `numbers_multidevice_link` FOREIGN KEY (parent_id) REFERENCES `numbers` (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `numbers_sim_type_link` FOREIGN KEY (sim_type) REFERENCES `sim_types` (id) ON DELETE SET NULL ON UPDATE CASCADE
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;
