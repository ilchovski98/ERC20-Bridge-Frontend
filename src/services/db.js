export const getTransactions = async (targetChainId, userAddress) => {
  if (userAddress && targetChainId) {
    return await fetch(
      `http://localhost:8000/api/transactions/${userAddress}/${targetChainId}`,
    ).then(response => response.json());
  }
};

export const getUserHistory = async userAddress => {
  if (userAddress) {
    return await fetch(`http://localhost:8000/api/transactions/${userAddress}`).then(response =>
      response.json(),
    );
  }
};
