import React from "react";
import { useHistory } from "react-router-dom";
import { Container, Header, Button } from "semantic-ui-react";

const fontSize = "1.2rem";

const section = (title, content) => (
  <>
    <Header
      as="h3"
      style={{ color: "white" }}
    >
      {title}
    </Header>
    <p style={{ fontSize }}>{content}</p>
  </>
);

const MLCompetitionInfo = () => {

  const history = useHistory();

  return (
    <Container className="ml-info">
      <Header
        as="h1"
        style={{ color: "white", fontSize: "3rem" }}
      >
        Welcome to the ASTRO Lab Machine Learning and AI competition for Fall 2020.
      </Header>
      <Header
        as="h2"
        style={{ color: "white" }}
      >
        The ASTRO Lab currently engages over 50 undergraduate and graduate students on a wide range of research
        and development projects related to aerospace and engineering applications.
      </Header>
      {section(
        "Your Team",
        "One of our current projects on creating digital twin models for complex operational facilities " +
          "is the subject of this semester’s Machine Learning and AI competition. You are invited to form a " +
          "team to compete in the challenge. Successful winning teams can win cash prizes. This competition will " +
          "take place over a 4 week period from Oct 29th to Nov 25th."
      )}
      {section(
        "The Challenge",
        "While creating digital twins, we often require the interpretation of an engineering drawing that provides " +
          "a high level overview of the process flow and components. Unfortunately, while much of this data is created " +
          "digitally, there are many facilities that only keep images, rather than editable, purpose built files. " +
          "In order to use the data, we must first organize the information as a list of connections and components " +
          "in a tabular format (like a CSV).  Your mission, should you choose to accept it, is to create a computer " +
          "vision algorithm to extract all the information from these diagrams and convert it into a simple list (CSV) " +
          "of components and connections."
      )}

      <p style={{ fontSize }}>
        The challenge is divided into two parts:<br/>
        &nbsp; Part 1 &nbsp; (Weeks 1&amp;2): &nbsp; Recognize equipment, components and labels in the diagrams.<br/>
        &nbsp;&nbsp; First Prize: $500 <br/>
        &nbsp;&nbsp; Second Prize: $250 <br/>
        &nbsp; Part 2 &nbsp; (Weeks 3&amp;4): &nbsp; Recognize all the connections between equipment/components.<br/>
        &nbsp;&nbsp; First Prize: $1000 <br/>
        &nbsp;&nbsp; Second Prize: $500 <br/>
        &nbsp;&nbsp; Third Prize: $250 <br/><br/>
        Successful teams must participate in each part of the competition. You will have two weeks to produce a model
        for each part, and you must succeed in Part 1 to advance to Part 2.
      </p>

      {section(
        "Methodology",
        "While the focus of this competition is machine learning, you are free to experiment with any algorithms, " +
          "or image processing techniques you please. If you choose to use ML, specifically convolutional neural networks, " +
          "or some other deep learning based approach, we will only support code written in python 3.6, 3.7, 3.8 using " +
          "Tensorflow 2.3, Tensorflow 1.15, or PyTorch 1.6. You are free to use any other library that we can pip install."
      )}

      <p style={{ fontSize }}>
        More details on the dataset we will use, submission specifics and evaluation criteria will be given on the
        start date (Oct 29th).
        <br/><br/>
        Sign up your team today - each team member should access the website to join your team. The only requirement
        or limitation on teams is that there is a 10-person maximum.
        <br/><br/>
        Good Luck!!!
        <br/><br/>
        - &nbsp; The ASTRO Lab
      </p>

      <div style={{ textAlign: "center" }}>
        <Button huge primary style={{ minWidth: "10rem" }}
                onClick={() => history.push("/signup")}
        >
          Sign Up
        </Button>
      </div>
    </Container>
  );
};

export default MLCompetitionInfo;
