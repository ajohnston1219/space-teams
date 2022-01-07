import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ErrorTag } from "../utils/enums";
import {
    Card,
    Message,
    Item,
    Loader
} from "semantic-ui-react";
import SimItem from "./SimItem";
import { getSims } from "../actions/sims";
import { getTaggedErrors } from "../selectors/errors";

const SimsList = () => {

    const dispatch = useDispatch();

    const sims = useSelector((state) => state.sims.list);
    const loading = useSelector((state) => state.sims.loading);
    const refreshing = useSelector((state) => state.sims.refreshing);
    const loggedIn = useSelector((state) => state.user.loggedIn);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.SIMS));

    React.useEffect(() => {
        const shouldGetSims = (loggedIn &&
                               !errors &&
                               !sims &&
                               !loading &&
                               !refreshing);
        if (shouldGetSims)
            dispatch(getSims());

    }, [loggedIn, errors, sims, loading, refreshing, getSims]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (loggedIn && !errors && !refreshing)
                dispatch(getSims(true));
        }, 10000);

        if (errors)
            clearInterval(interval);

        return () => clearInterval(interval);
    }, [getSims, errors, loggedIn, refreshing]);

    const renderContent = (teams, loading) => {
        if (loading) {
            return (
                <Loader active/>
            );
        }

        if (errors) {
            return (
                <Message negative>
                  <Message.Header>Oops! We had trouble getting your sims.</Message.Header>
                  {errors.map((e, i) => <p key={i}>{e.message}</p>)}
                </Message>
            );
        }

        if (sims.length === 0) {
            return (
                <Message>
                  <Message.Header>There aren't any active sims right now</Message.Header>
                  <p>Start up SpaceCRAFT and log in to start a sim and invite your friends</p>
                </Message>
            );
        }

        if (sims) {
            return (
                <Item.Group divided>
                  {sims.map(s => <SimItem key={s.id} sim={s}/>)}
                </Item.Group>
            );
        }
    };

    return (
        <Card className="dashboard-card" centered>
          <Card.Content>
            <Card.Header>Sims</Card.Header>
          </Card.Content>
          <Card.Content>
            {renderContent(sims, loading)}
          </Card.Content>
        </Card>
    );
};

export default SimsList;
