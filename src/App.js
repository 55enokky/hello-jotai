import React from "react";
import { Provider, atom, useAtom } from "jotai";

import "./App.css";

const URL = "https://gist.githubusercontent.com/55enokky/8d38751807d84af2f544b9442b6cbd22/raw/9f8353906d11c6edbf951177f47a23978b06b9cf/address-tokyo.json";

// URLからデータをfetchする
const addressAtom = atom(async () =>
  fetch(URL + `?ts=${new Date().getTime()}`).then((resp) => resp.json())
);

// inputに入力された値を保持する
const filterAtom = atom("");

// jsonに入力された値が含まれる場合にデータを返す
const filteredAddressAtom = atom((get) =>
  get(addressAtom).filter((p) =>
    p.zipcode.startsWith(get(filterAtom))
  )
);
const FilterInput = () => {
  const [filter, filterSet] = useAtom(filterAtom);

  return (
    <input value={filter} onChange={(evt) => filterSet(evt.target.value)} />
  );
}

const AddressTable = () => {
  const [filtered] = useAtom(filteredAddressAtom);
  return (
    <table width="100%">
      <tbody>
        {filtered.map((p, index) => (
          <tr key={index}>
            <td>{p.zipcode}</td>
            <td>{`${p.prefecture} ${p.city} ${p.town}`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const App = () => {
  return (
    <div className="App">
      <FilterInput />
      <AddressTable />
    </div>
  );
}

export default () => (
  <Provider>
    <React.Suspense fallback={<div>Loading</div>}>
      <App />
    </React.Suspense>
  </Provider>
);
