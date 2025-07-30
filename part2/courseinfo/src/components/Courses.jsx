const Header = ({ header }) => {
  return (
    <div>
      <h1>{header}</h1>
    </div>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => {
        return <Part key={part.id} part={part} />;
      })}
    </div>
  );
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Total = ({ parts }) => {
  const total = parts.reduce(
    (accumulator, currentValue) => accumulator + currentValue.exercises,
    0
  );
  return (
    <div>
      <h3>total of {total} exercises</h3>
    </div>
  );
};

const Courses = ({ courses }) => {
  return (
    <div>
      {courses.map((course) => {
        return (
          <div key={course.id}>
            <Header header={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
          </div>
        );
      })}
    </div>
  );
};

export default Courses;
