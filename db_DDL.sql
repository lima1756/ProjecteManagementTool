CREATE TABLE person(
    id INT GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1) PRIMARY KEY,
    username VARCHAR(20),
    password VARCHAR(120),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_img VARCHAR(120)
);

CREATE TABLE team(
    id INT GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1) PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    creation_date DATE NOT NULL
);

CREATE TABLE team_permissions(
    person_id INT,
    team_id INT,
    creator NUMBER(1) DEFAULT 0 NOT NULL,
    task_create NUMBER(1) DEFAULT 0 NOT NULL,
    task_edit NUMBER(1) DEFAULT 0 NOT NULL,
    milestone_create NUMBER(1) DEFAULT 0 NOT NULL,
    milestone_edit NUMBER(1) DEFAULT 0 NOT NULL,
    milestone_task_delete NUMBER(1) DEFAULT 0 NOT NULL,
    tags_create NUMBER(1) DEFAULT 0 NOT NULL,
    tags_edit NUMBER(1) DEFAULT 0 NOT NULL,
    tags_delete NUMBER(1) DEFAULT 0 NOT NULL,
    list_create NUMBER(1) DEFAULT 0 NOT NULL,
    list_delete NUMBER(1) DEFAULT 0 NOT NULL,
    tasks_in_lists_move NUMBER(1) DEFAULT 0 NOT NULL,
    CONSTRAINT team_permissions_pk PRIMARY KEY (person_id, team_id),
    CONSTRAINT team_permissions_fk_person FOREIGN KEY (person_id) REFERENCES person(id),
    CONSTRAINT team_permissions_fk_team FOREIGN KEY (team_id) REFERENCES team(id)
);

CREATE TABLE emails(
    email VARCHAR(80),
    person_id INT,
    CONSTRAINT emails_pk PRIMARY KEY (email, person_id),
    CONSTRAINT emails_fk FOREIGN KEY (person_id) REFERENCES person(id)
);

CREATE TABLE project(
    id INT GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1) PRIMARY KEY,
    project_name VARCHAR(40),
    project_state VARCHAR(6) CHECK( project_state IN ('open','closed') )
);

CREATE TABLE project_permissions(
    person_id INT,
    project_id INT,
    creator NUMBER(1) DEFAULT 0 NOT NULL,
    task_create NUMBER(1) DEFAULT 0 NOT NULL,
    task_edit NUMBER(1) DEFAULT 0 NOT NULL,
    milestone_create NUMBER(1) DEFAULT 0 NOT NULL,
    milestone_edit NUMBER(1) DEFAULT 0 NOT NULL,
    milestone_task_delete NUMBER(1) DEFAULT 0 NOT NULL,
    tags_create NUMBER(1) DEFAULT 0 NOT NULL,
    tags_edit NUMBER(1) DEFAULT 0 NOT NULL,
    tags_delete NUMBER(1) DEFAULT 0 NOT NULL,
    list_create NUMBER(1) DEFAULT 0 NOT NULL,
    list_delete NUMBER(1) DEFAULT 0 NOT NULL,
    tasks_in_lists_move NUMBER(1) DEFAULT 0 NOT NULL,
    CONSTRAINT project_permissions_pk PRIMARY KEY (person_id, project_id),
    CONSTRAINT project_permissions_fk_person FOREIGN KEY (person_id) REFERENCES person(id),
    CONSTRAINT project_permissions_fk_project FOREIGN KEY (project_id) REFERENCES project(id)
);

CREATE TABLE tag(
    id INT GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1) PRIMARY KEY,
    tag_name VARCHAR(20),
    color VARCHAR(6),
    project_id INT,
    CONSTRAINT tag_fk_project FOREIGN KEY (project_id) REFERENCES project(id)
);

CREATE TABLE milestone(
    id INT GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1) PRIMARY KEY, 
    milestone_name VARCHAR(40) NOT NULL,
    milestone_description VARCHAR(4000) NOT NULL,
    deadline DATE,
    milestone_state VARCHAR(6) DEFAULT 'open' CHECK( milestone_state IN ('open','closed') ) NOT NULL,
    visible NUMBER(1) DEFAULT 0 NOT NULL
);

CREATE TABLE milestone_tag(
    milestone_id INT,
    tag_id INT,
    CONSTRAINT milestone_tag_pk PRIMARY KEY (milestone_id, tag_id),
    CONSTRAINT milestone_tag_fk_mileston FOREIGN KEY (milestone_id) REFERENCES milestone(id),
    CONSTRAINT milestone_tag_fk_tag FOREIGN KEY (tag_id) REFERENCES tag(id)
);

CREATE TABLE task(
    id INT GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1) PRIMARY KEY,
    task_name VARCHAR(40) NOT NULL,
    task_description VARCHAR(4000) NOT NULL,
    deadline DATE,
    task_state VARCHAR(15) DEFAULT 'open' CHECK( task_state IN ('open','closed', 'closed_finished') ) NOT NULL,
    milestone_id INT,
    CONSTRAINT task_fk_milestone FOREIGN KEY (milestone_id) REFERENCES milestone(id)
);

CREATE TABLE task_tag(
    task_id INT,
    tag_id INT,
    CONSTRAINT task_tag_pk PRIMARY KEY (task_id, tag_id),
    CONSTRAINT task_tag_fk_mileston FOREIGN KEY (task_id) REFERENCES task(id),
    CONSTRAINT task_tag_fk_tag FOREIGN KEY (tag_id) REFERENCES tag(id)
);

CREATE TABLE person_works_task(
    task_id INT NOT NULL,
    person_id INT NOT NULL,
    CONSTRAINT person_works_task_pk PRIMARY KEY (task_id, person_id),
    CONSTRAINT person_works_task_fk_person FOREIGN KEY (person_id) REFERENCES person(id),
    CONSTRAINT person_works_task_fk_task FOREIGN KEY (task_id) REFERENCES task(id)
);

CREATE TABLE task_comment(
    id INT GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1) PRIMARY KEY,
    content VARCHAR(4000) NOT NULL,
    task_id INT NOT NULL,
    person_id INT NOT NULL,
    CONSTRAINT comment_fk_task FOREIGN KEY (task_id) REFERENCES task(id),
    CONSTRAINT comment_fk_person FOREIGN KEY (person_id) REFERENCES person(id)
);

CREATE TABLE list(
    id INT GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1) PRIMARY KEY,
    next_list_id INT,
    tag_id INT,
    CONSTRAINT list_fk_list FOREIGN KEY (next_list_id) REFERENCES list(id),
    CONSTRAINT list_fk_tag FOREIGN KEY (tag_id) REFERENCES tag(id)
);
