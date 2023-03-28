import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useNetwork, useSigner, useAccount } from 'wagmi';

import LoadingSpinner from '../components/ui/LoadingSpinner';
import Connect from '../components/layout/Connect';

import { getUserHistory } from '../services/db';
import { chainsById } from '../config';

function Claim() {
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();

  const [claimData, setClaimData] = useState();
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const updateClaimData = useCallback(async () => {
    if (signer) {
      setIsHistoryLoading(true);
      const claimDataValue = await getUserHistory(signer?._address);
      setClaimData(claimDataValue);
      setIsHistoryLoading(false);
    }
  }, [setClaimData, signer]);

  useEffect(() => {
    if (signer) {
      updateClaimData();
    }
  }, [updateClaimData, signer]);

  const info = claimData && claimData?.map((tx, index) => {
    const fromChain = chainsById[tx?.fromChain]?.label;
    const toChain = chainsById[tx?.toChain]?.label;
    const fromTokenSymbol = tx?.fromTokenSymbol;
    const toTokenSymbol = tx?.claimData?.targetTokenSymbol;

    return (
      <div className="history__body">
        <div className="history__item"><span className="text-light">{fromChain}</span> ➡️ <span className="text-light">{toChain}</span></div>
        <div className="history__item"><span className="text-light">{fromTokenSymbol}</span> ➡️ <span className="text-light">{toTokenSymbol}</span></div>
        <div className="history__item"><span className="text-light">{ethers.utils.formatEther(tx?.claimData?.value || 0)}</span></div>
        <div className="history__item"><span className="text-light">{tx?.isClaimed ? 'Claimed' : 'Not Claimed'}</span></div>
      </div>
    )
  });


  const transferContent = <>
    {
      !isHistoryLoading ?
      <div className="history">
        <div className="history__head">
          <div className="history__item">Chains</div>

          <div className="history__item">Token</div>

          <div className="history__item">Amount</div>

          <div className="history__item">Status</div>
        </div>

        { info }
      </div> :
      <div className="spinner-container">
        <LoadingSpinner />
      </div>
    }
  </>;

  return (
    <div className="transfer-form">
      <div className="shell-medium">
        <h1 className="text-light">History</h1>

        {
          isConnected ?
          (
            claimData?.length > 0 ?
            transferContent :
            <p className="text-center">There are no previous transactions</p>
          ) :
          <Connect />
        }
      </div>
    </div>
  );
}

export default Claim;
