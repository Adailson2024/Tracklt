import { useContext, useEffect } from "react";
import styled from "styled-components";
import { AiFillCheckSquare } from "react-icons/ai";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import "react-circular-progressbar/dist/styles.css";
import trackIt from "../assets/TrackIt.png";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";


dayjs.locale("pt-br");

const TodayPage = () => {
  const {
    image,
    token,
    habitList,
    updateHabitList,
    completedHabits,
    updateCompletedHabits,
    totalHabits,
  } = useContext(AuthContext);

  const percentageCompleted =
    totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
  const restoreCompletedHabits = () => {
    const savedHabits = localStorage.getItem("completedHabits");
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits);
      updateHabitList(parsedHabits);
    }
  };

  useEffect(() => {
    if (token != null) {
      handleGetHabits();
      restoreCompletedHabits();
    }
  }, [token]);

  useEffect(() => {
    if (token != null) {
      handleGetHabits();
      restoreCompletedHabits();
    }
  }, [token]);

  const handleGetHabits = () => {
    axios
      .get(
        "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/today",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        updateHabitList(response.data);
        console.log("Habits retrieved successfully:", response.data);
      })
      .catch((error) => {
        console.log("Error retrieving habits:", error);
      });
  };

  useEffect(() => {
    const countCompletedHabits = habitList.filter((habit) => habit.done).length;
    updateCompletedHabits(countCompletedHabits);

    
    saveCompletedHabits(habitList);
  }, [habitList]);

  const saveCompletedHabits = (habits) => {
    localStorage.setItem("completedHabits", JSON.stringify(habits));
  };

  const toggleHabitCompletion = (habitId) => {
    const habit = habitList.find((habit) => habit.id === habitId);
    if (!habit) {
      return;
    }

    const endpoint = habit.done
      ? `https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${habitId}/uncheck`
      : `https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${habitId}/check`;

    axios
      .post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const updatedHabit = habitList.map((habit) =>
          habit.id === habitId ? { ...habit, done: !habit.done } : habit
        );
        updateHabitList(updatedHabit);
        console.log("Hábito marcado como concluído:", response.data);
        handleGetHabits();
      })
      .catch((error) => {
        console.log("Erro ao marcar o hábito como concluído:", error);
      });
  };

  console.log(`Teste HabitList`, true.toString());
  return (
    <Wrapper>
      <Nav data-test="header">
        <TrackDiv>
          <TrackLogo src={trackIt} alt="TrackIt" />
        </TrackDiv>
        <UserImage data-test="avatar" src={image} alt="Bob" />
      </Nav>
      <Container>
        <Day data-test="today-counter">
        <Title data-test="today">{dayjs().format("dddd, DD/MM").replace(/^./, dayjs().format("dddd")[0].toUpperCase())}</Title>
          
        </Day>
        <HabitsContainer>
          {habitList.map((habit) => (
            <HabitCard
              data-test="today-habit-container"
              key={habit.id}
              completed={habit.done}
              onClick={() => toggleHabitCompletion(habit.id)}
            >
              <HabitCardText>
                <HabitTitle data-test="today-habit-name">
                  {habit.name}
                </HabitTitle>
                <HabitInfo>
                  <InfoText data-test="today-habit-sequence">
                    Sequência atual:{" "}
                    <SequenceValue completed={habit.done}>
                      {habit.currentSequence} dias
                    </SequenceValue>
                  </InfoText>
                  <InfoText data-test="today-habit-record">
                    Sequência recorde:{" "}
                    <SequenceValue
                      completed={habit.done}
                      record={habit.highestSequence > habit.currentSequence}
                    >
                      {habit.highestSequence} dias
                    </SequenceValue>
                  </InfoText>
                </HabitInfo>
              </HabitCardText>
              <HabitIconWrapper>
                <HabitIcon
                  data-test="today-habit-check-btn"
                  completed={habit.done}
                />
              </HabitIconWrapper>
            </HabitCard>
          ))}
        </HabitsContainer>
      </Container>
      <Footer data-test="menu">
        <Habits data-test="habit-link" to="/habitos">
          <TitleHabit>
            Hábitos
          </TitleHabit>
        </Habits>
        

        <Today data-test="today-link" to="/hoje">
          <TitleToday>Hoje</TitleToday>
        </Today>
      </Footer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #e5e5e5;
`;
const ProgressContainer = styled.div`
  cursor: pointer;
`;

const TrackLogo = styled.img`
  width: 97px;
  height: 49px;
`;

const TrackDiv = styled.div`
  display: flex;
`;
const UserImage = styled.img`
  width: 51px;
  height: 51px;
  border-radius: 98.5px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Nav = styled.nav`
  height: 70px;
  background: rgb(18, 107, 165);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 4px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const FooterTitle = styled.button`
  font-family: "Lexend Deca";
  font-style: normal;
  font-weight: 400;
  font-size: 17.976px;
  line-height: 22px;
  text-align: center;
  color: #52b6ff;
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;
const Day = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const Title = styled.h2`
  font-family: "Lexend Deca", sans-serif;
  font-weight: 400;
  font-size: 22.976px;
  line-height: 29px;
  color: #126ba5;
`;
const Habits = styled(Link)`
  text-decoration: none;
  background: #52B6FF;
width: 50%;
height: 65px;
top: 602px;
cursor:pointer;
display: grid;
place-items: center;

`;
const TitleHabit=styled.button`
font-family: "Lexend Deca";
  font-style: normal;
  font-weight: 400;
  font-size: 17.976px;
  line-height: 22px;
  text-align: center;
  color: #ffffff;
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
`
const TitleToday=styled.button`
font-family: "Lexend Deca";
  font-style: normal;
  font-weight: 400;
  font-size: 17.976px;
  line-height: 22px;
  text-align: center;
  color: #d4d4d4;
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
`
const Today=styled(Link)`
text-decoration: none;
background: #ffffff;
width: 50%;
top: 602px;
left: 187px;
cursor:pointer;
display: grid;
place-items: center;
`;

const NoHabitsText = styled.p`
  font-family: "Lexend Deca", sans-serif;
  font-weight: 400;
  font-size: 17.976px;
  line-height: 22px;
  color: #bababa;
`;

const HabitsText = styled.p`
  font-family: "Lexend Deca", sans-serif;
  font-weight: 400;
  font-size: 17.976px;
  line-height: 22px;
  color: ${({ percentage }) => (percentage > 0 ? "#8FC549" : "#8FC549")};
`;

const HabitsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const HabitCard = styled.div`
  width: 340px;
  height: 94px;
  background: #ffffff;
  border-radius: 5px;
  margin: 16px;
  display: flex;
  align-items: center;
  .circular-progressbar {
    width: 69px;
    height: 69px;
  }
`;

const HabitCardText = styled.div`
  flex: 1;
  margin: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const HabitIconWrapper = styled.div`
  width: 69px;
  height: 69px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HabitIcon = styled(AiFillCheckSquare)`
  width: 69px;
  height: 69px;
  color: ${({ completed }) => (completed ? "#8FC549" : "#ebebeb")};
  border-radius: 5px;
  transition: color 0.2s ease;
`;

const HabitTitle = styled.h3`
  font-family: "Lexend Deca", sans-serif;
  font-weight: 400;
  font-size: 19.976px;
  line-height: 25px;
  color: #666666;
`;

const HabitInfo = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
`;

const InfoText = styled.p`
  font-family: "Lexend Deca", sans-serif;
  font-weight: 400;
  font-size: 12.976px;
  line-height: 16px;
  color: #666666;
  margin-top: 7px;
`;

const SequenceValue = styled.span`
  color: ${({ completed }) => (completed ? "#8FC549" : "#666666")};
  opacity: ${({ completed, record }) => (completed && record ? "0.5" : "1")};
`;

const Footer = styled.footer`
  height: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #ffffff;
`;

export default TodayPage;