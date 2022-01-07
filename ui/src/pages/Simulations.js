import React from "react";
import { useSelector } from "react-redux";

const Simulations = () => {

    const simulations = useSelector((state) => state.simulations);

    return (
       <div>STUFF</div>
    );
};

export default Simulations;
