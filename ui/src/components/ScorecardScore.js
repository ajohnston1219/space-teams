import React from "react";
import {
    Statistic
} from "semantic-ui-react";

const ScorecardScore = ({ score }) => {
    let header_class = "ui red header";
    let float_score = parseFloat(score)
    if (isNaN(float_score)) {
        float_score = "--";
    } else {
        if (float_score >= 60.0 && float_score < 70.0) {
            header_class = "ui orange header"
        } else if (float_score >= 70.0 && float_score < 80.0) {
            header_class = "ui yellow header"
        } else if (float_score >= 80.0 && float_score < 90.0) {
            header_class = "ui olive header"
        } else if (float_score >= 90.0) {
            header_class = "ui green header"
        }
    }
    try {
        float_score = float_score.toFixed(2).toString();
    } catch (err) {
        console.error(err);
        float_score = "--";
    }

    return (
        <Statistic size="small">
            <Statistic.Value className={header_class}>{float_score}</Statistic.Value>
            <Statistic.Label>Points</Statistic.Label>
        </Statistic>
    );
};

export default ScorecardScore;
