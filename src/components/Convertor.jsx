import { Card, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { BsCurrencyExchange } from "react-icons/bs";
import "./Convertor.css";
const axios = require("axios");
const Convertor = () => {
  const baseurl = "https://crypto-convertor.onrender.com/v1/priceConverter/";
  const defaultfirst = "Ethereum";
  const defaultsecond = "inr";
  const [cryptolist, setcryptolist] = useState();
  const [fiatlist, setfiatlist] = useState();
  const [inputvalue, setinputvalue] = useState(1);
  const [firstselect, setfirstselect] = useState(defaultfirst);
  const [secondselect, setsecondselect] = useState(defaultsecond);
  const [result, setresult] = useState("0.000000");

  /*
  * function to get coins and fait lists
  */
  const getpriceConvertordata = () => {
    let endpoints = [
      `${baseurl}coinsList`,
      `${baseurl}currencyList`,
    ];
    Promise.all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(([{ data: coinsList }, { data: currencyList }]) => {
        const Temparrcoin = coinsList.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setcryptolist(Temparrcoin);

        const Temparrfiat = currencyList.map((item) => {
          return {
            value: item,
            label: item,
          };
        });
        setfiatlist(Temparrfiat);
      })
      .catch(function (error) {
        console.log(
          `Request to ${baseurl} failed with ${
            error.response?.status
          } status code, ${error.toString()}. Unable to get cryptocurrency. Try to restart InfoService or there will be no cryptocurrency.`,
          "error"
        );
      });
  };

  useEffect(() => {
    getpriceConvertordata();
  }, []);

  /*
  * function to convert crypto to fiat
  */
  const getprice = () => {
    let endpoints = [
      `${baseurl}getPrice?coin=${firstselect.toLowerCase()}&fiat=${secondselect}&amount=${inputvalue}`,
    ];
    Promise.all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(([{ data: price }]) => {
        setresult(price.price);
      })
      .catch(function (error) {
        console.log(
          `Request to ${baseurl} failed with ${
            error.response?.status
          } status code, ${error.toString()}. Unable to get cryptocurrency. Try to restart InfoService or there will be no cryptocurrency.`,
          "error"
        );
      });
  };

  useEffect(() => {
    getprice();
  }, [inputvalue, firstselect, secondselect]);

  return (
    <>
      <div className="container">
        <Card
          className="crypto-card"
          title={
            <h1 className="icon">
              <BsCurrencyExchange />
              Crypto Convertor
            </h1>
          }
        >
          <Form>
            <Form.Item>
              <Input
                placeholder="Enter Amount To Convert"
                allowClear="true"
                bordered="true"
                onChange={(e) => {
                  if (e.target.value > 0) {
                    setinputvalue(e.target.value);
                  } else {
                    setinputvalue(1);
                  }
                }}
              />
            </Form.Item>
          </Form>
          <div className="select-box">
            <Select
              showSearch="true"
              style={{ width: 160 }}
              defaultValue={defaultfirst}
              options={cryptolist}
              onChange={(value) => {
                setfirstselect(value);
              }}
            />
            <Select
              showSearch="true"
              style={{ width: 160 }}
              defaultValue={defaultsecond}
              options={fiatlist}
              onChange={(value) => {
                setsecondselect(value);
              }}
            />
          </div>
          <p style={{ marginTop: "20px" }}>
            {inputvalue}&nbsp;{firstselect}&nbsp;=&nbsp;{result}&nbsp;
            {secondselect}
          </p>
        </Card>
      </div>
    </>
  );
};

export default Convertor;
