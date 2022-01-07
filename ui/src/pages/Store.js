import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { getCompetitionList, addToCart, removeFromCart } from "../actions/billing";
import { setActiveNavTab } from "../actions/ui";
import { NavTab } from "../utils/enums";
import moment from "moment";
import {
    Button,
    Card
} from "semantic-ui-react";

import StoreList from "../components/StoreList";

const DATE_FORMAT = "MMM Mo, YYYY";

const Store = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    let competitionId = useSelector((state) => state.user.desiredCompetitionId);
    if (!competitionId) {
        competitionId = new URLSearchParams(location.search).get("competition_id");
        if (competitionId) {
            localStorage.setItem("competition_id", competitionId);
        } else {
            competitionId = localStorage.getItem("competition_id");
        }
    }

    const loading = useSelector((state) => state.billing.competitions.loading);
    const competitionList = useSelector((state) => state.billing.competitions.list);
    const cart = useSelector((state) => state.billing.cart.items);

    const isSelected = (comp) => {
        return cart.some((item) => item.id === comp.id);
    };

    const handleAddToCart = (id) => {
        dispatch(addToCart(id));
    };

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id));
    };

    useEffect(() => {
        dispatch(setActiveNavTab(NavTab.STORE));
        dispatch(getCompetitionList());
        if (competitionId) {
            handleAddToCart(competitionId);
        }
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <p>
                    Loading...
                </p>
            );
        }
        return (
            <StoreList
                items={competitionList.map((comp) => {
                    const startDate = moment(comp.startDate);
                    const endDate = moment(comp.endDate);
                    return {
                        id: comp.id,
                        name: comp.name,
                        price: Number.parseFloat(comp.price).toFixed(2),
                        description: `${startDate.format(DATE_FORMAT)} - ${endDate.format(DATE_FORMAT)}`,
                        selected: isSelected(comp)
                    };
                })}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
            />
        );
    };

    return (
        <Card className="dashboard-card" centered>
            <Card.Content>
                <Card.Header>Competitions</Card.Header>
            </Card.Content>
            <Card.Content>
                {renderContent()}
            </Card.Content>
            <Card.Content>
                <Button
                    onClick={() => history.push("/cart")}
                    primary
                    fluid
                >
                    Cart
                </Button>
            </Card.Content>
        </Card>
    );
}

export default Store;
