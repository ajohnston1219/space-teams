/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import CompetitionItem from "./CompetitionItem";
import { uniqueById } from "../utils/unique";

const CompetitionsList = () => {

    const competitions = useSelector(
        (state) => state.competitions.userComps.filter(c => c.teamIsActive)
    );
    const loading = useSelector((state) => state.competitions.loading);

    const renderList = (loading, competitions) => {
        if (!loading && competitions && competitions.length) {
            return (
                <>
                  {competitions.map(comp => (
                      <Grid key={comp.id} stackable>
                        <Grid.Row centered style={{ textAlign: "left" }}>
                          <CompetitionItem competition={comp} />
                        </Grid.Row>
                      </Grid>
                  ))}
                </>
            );
        }
        return (
            "No active competitions"
        );
    };

    return (
        <>
          {renderList(loading, competitions)}
        </>
    )
};

export default CompetitionsList;
