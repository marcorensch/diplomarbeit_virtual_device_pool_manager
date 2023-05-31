CREATE TABLE IF NOT EXISTS `guide_slides`
(
    id         int(11)      NOT NULL AUTO_INCREMENT,
    name       varchar(255) NOT NULL,
    uri        varchar(255) NOT NULL,
    content    text         NOT NULL,
    notes      text         NOT NULL,
    guide_id   int(11)      NOT NULL,
    sorting    int(11)      NOT NULL DEFAULT 0,
    created_at timestamp    NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT `fk_guide_id` FOREIGN KEY (guide_id) REFERENCES guides (id) ON DELETE CASCADE ON UPDATE CASCADE
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;