export const getCart = (state) => {
    const ids = state.billing.cart.items.map((item) => item.id);
    const items = state.billing.competitions.list
        .filter((comp) => ids.some(id => comp.id === id));
    const cart = {
        ...state.billing.cart,
        items
    };

    return cart;
};

export const getSubtotal = (state) => {
    const cart = getCart(state);
    const subtotal = cart.items.reduce((total, item) => total + Number.parseFloat(item.price), 0.0);
    return subtotal;
};

export const getTotalDiscount = (state) => {
    const cart = getCart(state);
    const appliedDiscounts = cart.discounts;
    const totalDiscount = cart.items.reduce((total, item) => {
        const discount = appliedDiscounts
              .reduce((amt, d) => {
                  const a = Number.parseFloat(d.amounts[item.id]);
                  if (a) {
                      return amt + a;
                  }
                  return amt;
              }, 0.0);
        const amount = discount * Number.parseFloat(item.price);
        return total + amount;
    }, 0.0);
    return totalDiscount;
};
