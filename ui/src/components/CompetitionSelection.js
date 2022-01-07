import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Form,
    Dropdown
} from "semantic-ui-react";
import { setCurrentCompetition } from "../actions/competitions";
import { UserType } from "../utils/enums";
import { uniqueById } from "../utils/unique";

const formStyle = {
    margin: "1rem auto"
};
const labelStyle = {
    color: "white",
    marginRight: "1rem"
};
const fieldStyle = {
    textAlign: "center"
};

const Loading = () => {
    return (
        <p>Loading Competitions...</p>
    );
};

const CompetitionSelection = () => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const comp = useSelector((state) => state.competitions.currentCompetition);
    const userComps = useSelector(
        (state) => uniqueById(state.competitions.userComps.filter(c => !c.teamId || c.teamIsActive))
    );
    const activeComps = useSelector((state) => state.competitions.activeComps);
    const compsList = user.type === UserType.ADMIN ? activeComps : userComps;

    if (!compsList) {
        return (
            <Loading/>
        );
    }
    if (compsList.length === 0) {
        return <div/>;
    }
    return (
        <Form style={formStyle}>
            <Form.Field inline style={fieldStyle}>
                <label style={labelStyle}>Selected Competition: </label>
                <Dropdown name="competition" text={comp ? comp.name : ""}>
                    <Dropdown.Menu>
                        {compsList.map(c => (
                            <Dropdown.Item
                                key={c.id}
                                text={c.name}
                                onClick={() => dispatch(setCurrentCompetition(c))}
                            />
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Form.Field>
        </Form>
    );
};

export default CompetitionSelection;
