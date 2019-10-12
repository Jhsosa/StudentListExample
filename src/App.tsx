import React, { useEffect, useRef, useState } from "react";
import * as http from "http";
import dataJson from "./assets/students.json";

// Styles
import classes from "./styles.scss";

type StudentData = {
  city: string;
  company: string;
  email: string;
  firstName: string;
  grades: number[];
  id: number;
  lastName: string;
  pic: string;
  skill: string;
};

export default function App(): JSX.Element {
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [key, setKey] = useState<number>(0);
  const [studentInfo, setStudentInfo] = useState<JSX.Element[]>([]);
  const listItemRefs = useRef<{
    [id: number]: {
      name: string;
      tags: string[];
      ref: React.RefObject<HTMLLIElement>;
      expand: boolean;
    };
  }>({});
  useRef<HTMLLIElement>(null);

  const expandItem = (id: number) => (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (listItemRefs.current[id]) {
      listItemRefs.current[id].expand = !listItemRefs.current[id].expand;
      if (listItemRefs.current[id].expand) {
        event.currentTarget.textContent = "-";
      } else {
        event.currentTarget.textContent = "+";
      }
      setKey(key + 1);
    }
  };

  const addListRef = (id: number, name: string) => (ref: any) => {
    if (!listItemRefs.current[id]) {
      const tags: string[] = [];
      const expand = false;
      listItemRefs.current[id] = { name, tags, ref, expand };
    } else {
      listItemRefs.current[id].ref = ref;
    }
  };

  const addTag = (id: number) => (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      const tag = event.currentTarget.value;
      if (tag.length > 0) {
        if (!listItemRefs.current[id].tags.includes(tag)) {
          listItemRefs.current[id].tags.push(tag);
          setKey(key + 1);
        }
      }
    }
  };

  function showTags(id: number) {
    const tags: JSX.Element[] = [];
    if (listItemRefs.current[id]) {
      for (var j = 0; j < listItemRefs.current[id].tags.length; ++j) {
        tags.push(
          <div
            key={listItemRefs.current[id].tags[j]}
            className={classes["tag"]}
          >
            {listItemRefs.current[id].tags[j]}
          </div>
        );
      }
    }
    return <div className={"tag-box"}>{tags}</div>;
  }

  function createTestData(id: number, grades: number[]) {
    let gradeList: JSX.Element[] = [];
    for (var i = 0; i < grades.length; ++i) {
      gradeList.push(
        <p key={`test${i}`}>{`Test ${i + 1}:\t${grades[i] / 100}%`}</p>
      );
    }
    return (
      <div className={classes["list-item-grades"]}>
        {gradeList}
        {showTags(id)}
        <input type="text" placeholder="Add a tag" onKeyPress={addTag(id)} />
      </div>
    );
  }

  function showData(id: number) {
    if (!listItemRefs.current[id]) {
      return false;
    }
    return listItemRefs.current[id].expand;
  }

  function createStudentElement(data: StudentData) {
    const fullName = `${data.firstName} ${data.lastName}`;
    let avg = 0;
    for (var i = 0; i < data.grades.length; ++i) {
      avg += data.grades[i] / 100;
    }
    avg /= data.grades.length;
    avg *= 100;
    return (
      <li
        key={data.id}
        className={classes["list-item"]}
        ref={addListRef(data.id, fullName.toLowerCase())}
      >
        <img src={data.pic} className={classes["list-item-image"]} />
        <button
          className={classes["list-item-expand"]}
          onClick={expandItem(data.id)}
        >
          {"+"}
        </button>
        <div className={classes["list-item-data"]}>
          <h1>{fullName}</h1>
          <p>{`Email: ${data.email}`}</p>
          <p>{`Company: ${data.company}`}</p>
          <p>{`Skill: ${data.skill}`}</p>
          <p>{`Average: ${avg.toFixed(2)}%`}</p>
          {showData(data.id) ? createTestData(data.id, data.grades) : null}
        </div>
      </li>
    );
  }

  function filterNames(event: React.ChangeEvent<HTMLInputElement>) {
    const filter = event.currentTarget.value.toLowerCase();
    for (var key in listItemRefs.current) {
      const listItem = listItemRefs.current[key];
      if (!listItem.name.includes(filter)) {
        $(listItem.ref).css("display", "none");
      } else {
        $(listItem.ref).css("display", "flex");
      }
    }
  }

  function filterTags(event: React.ChangeEvent<HTMLInputElement>) {
    const filter = event.currentTarget.value.toLowerCase();
    for (var key in listItemRefs.current) {
      const listItem = listItemRefs.current[key];
      let isVisible = filter.length > 0 ? false : true;
      for (var j = 0; j < listItem.tags.length; ++j) {
        if (listItem.tags[j].includes(filter)) {
          isVisible = true;
          break;
        }
      }
      $(listItem.ref).css("display", isVisible ? "flex" : "none");
    }
  }

  function updateStudentElements(students: StudentData[]) {
    const elements: JSX.Element[] = [];
    for (var i = 0; i < students.length; ++i) {
      elements.push(createStudentElement(students[i]));
    }
    setStudentInfo(elements);
  }

  useEffect(() => {
    if (studentData) {
      updateStudentElements(studentData);
    }
  }, [studentData, key]);

  useEffect(() => {
    //@ts-ignore
    setStudentData(dataJson.students);
    // $.ajax({
    //   method: "GET",
    //   url: "https://www.example.com/students"
    // }).done(data => {
    //   if (!data.students) {
    //     console.error("Data not found");
    //   }
    //   updateStudentData(data.students);
    // });
  }, []);

  return (
    <div className={classes["wrapper"]}>
      <div className={classes["list-wrapper"]}>
        <ul className={classes["list"]}>
          <input
            type="text"
            placeholder="Search by name"
            onChange={filterNames}
          />
          <input
            type="text"
            placeholder="Search by tags"
            onChange={filterTags}
          />
          {studentInfo}
        </ul>
      </div>
    </div>
  );
}
