import React from "react";
import {
    Item
} from "semantic-ui-react";

import ScorecardScore from "./ScorecardScore";

const ScorecardComparison = ({ loading, myScorecard, theirScorecard }) => {

    if (loading) {
        return "LOADING...";
    }
    if (!myScorecard || !theirScorecard ) {
        return "NOT FOUND";
    }

    return (

        <Item.Group>

            <Item.Group className={"ui three column grid"}>

                <Item.Group className={"row"} style={{"backgroundColor": "#f0f8fa"}}>

                    <Item.Group className={"column"}>
                    </Item.Group>

                    <Item.Group className={"column"}>
                        <p className={"ui header"}>Mine</p>
                    </Item.Group>

                    <Item.Group className={"column"}>
                        <p className={"ui header"}>Theirs</p>
                    </Item.Group>

                </Item.Group>

            </Item.Group>

            {Object.keys(myScorecard).map(key => {
                const myScore = myScorecard[key];
                const theirScore = theirScorecard[key] || "0";

                return (
                    <Item.Group className={"ui three column grid"} key={key}>

                        <Item.Group className={"row"} style={{"backgroundColor": "#f0f8fa"}}>

                            <Item.Group className={"column"}>
                                <p className={"ui header"}>{key}</p>
                            </Item.Group>

                            <Item.Group className={"column"}>
                                <ScorecardScore score={myScore}/>
                            </Item.Group>

                            <Item.Group className={"column"}>
                                <ScorecardScore score={theirScore}/>
                            </Item.Group>

                        </Item.Group>

                    </Item.Group>
                );
            })}

        </Item.Group>
    );
}

export default ScorecardComparison;
