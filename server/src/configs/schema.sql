-- User Table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Class Table
CREATE TABLE classes (
  class_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_name VARCHAR(50),
  admin_id INT REFERENCES users(user_id)
);

-- Type for Class_Role
CREATE TYPE class_role AS ENUM ('admin', 'moderator', 'user');

-- Class_User Table
CREATE TABLE class_users (
  class_id UUID REFERENCES classes(class_id),
  user_id INT REFERENCES users(user_id),
  class_role class_role DEFAULT 'user',
	PRIMARY KEY (class_id, user_id)
);

-- Type for Event_Type
CREATE TYPE event_type AS ENUM ('class', 'exam', 'assignment', 'other');

-- Calendar_Event Table
CREATE TABLE calendar_events (
  class_id UUID REFERENCES classes(class_id),
  instructor_id INT REFERENCES users(user_id),
  event_name VARCHAR(50),
  event_type event_type,
  event_description VARCHAR(255),
  event_datetime TIMESTAMP,
  is_routine BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (class_id, event_datetime)
);

-- Type for Weekday
CREATE TYPE weekday AS ENUM ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

-- Routine_Event Table
CREATE TABLE routine_events (
  class_id UUID REFERENCES classes(class_id),
  instructor_id INT REFERENCES users(user_id),
  event_name VARCHAR(50),
  event_description VARCHAR(255),
  event_type event_type,
  event_day weekday,
  event_time TIME,
  PRIMARY KEY (class_id, event_day, event_time)
);

