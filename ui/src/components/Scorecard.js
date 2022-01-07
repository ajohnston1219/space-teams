import React from "react";
import {
    Item
} from "semantic-ui-react";

import ScorecardScore from "./ScorecardScore";

const Scorecard = ({ loading, activity }) => {

    if (loading) {
        return "LOADING...";
    }
    if (!activity || !activity.scorecard) {
        return "NOT FOUND";
    }

    return (

        <Item.Group>

            {Object.keys(activity.scorecard).map(key => {
                const score = activity.scorecard[key];

                return (
                    <Item.Group className={"ui two column grid"} key={key}>

                        <Item.Group className={"row"} style={{"backgroundColor": "#f0f8fa"}}>

                            <Item.Group className={"column"}>
                                <p className={"ui header"}>{key}</p>
                            </Item.Group>

                            <Item.Group className={"column"}>
                                <ScorecardScore score={score}/>
                            </Item.Group>

                        </Item.Group>

                    </Item.Group>
                );
            })}

        </Item.Group>
    );
}

export default Scorecard;
