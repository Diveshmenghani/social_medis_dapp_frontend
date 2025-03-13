import { useStateContext } from "../context/index";
export default function Header() {
  const { SelectedAccount, currentBal, connectWallet} = useStateContext();
  const shortenAddress = (SelectedAccount) => `${SelectedAccount?.slice(0, 5)}...${SelectedAccount?.slice(-4)}`;
  const shortenBal = (currentBal) =>`${currentBal?.slice(0,5)}`
  return (
    <div className="text-2xl flex flex-col items-center mb-12 text-center">
        {SelectedAccount ?(
        <span>Account:{shortenAddress(SelectedAccount)}: Bal:{shortenBal(currentBal)}</span>
        ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
        )}
    </div>
  );
}
