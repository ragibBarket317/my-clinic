import React, { useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md"; // Import the ChevronDownIcon from Heroicons
import PhoneInput from "react-phone-number-input/input";
import "react-phone-number-input/style.css"; // Import styles for react-phone-number-input

const PhoneNumberInput = ({ phoneNumber, onHandlePhoneNumberChange }) => {
  
  const [country, setCountry] = useState(phoneNumber?.country || "US"); // Set the default country code
  const [value, setValue] = useState(phoneNumber?.number || "");
  
  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  }; // Set the default country code
  useEffect(() => {
    setValue(value);
  }, [value]);
  useEffect(() => {
    setCountry(phoneNumber?.country);
    setValue(phoneNumber?.number);
  }, [phoneNumber]);
  

  return (
    <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
      <select
        value={country}
        onChange={handleCountryChange}
        className="appearance-none bg-transparent border-none pl-2 pr-4 py-2 w-[30%] outline-none"
      >
        <option value="US" default>(US) +1 </option>
        <option value="CA">(Canada) +1</option>
        <option value="GB">(UK) +44</option>
        <option value="AU">(Australia) +61</option>
        <option value="DE">(Germany) +49</option>
        <option value="FR">(France) +33</option>
        <option value="IT">(Italy) +39</option>
      </select>
      <MdArrowDropDown className="w-6 h-6 text-gray-400 pointer-events-none" />
      <PhoneInput
        // international
        country={country}
        value={value}
        onChange={(val) => onHandlePhoneNumberChange({ country, number: val })}
        placeholder="Enter phone number"
        className="flex-1 p-2 auth-input text-[18px] px-[20px] dark:bg-[--secondary]"
      />
    </div>
  );
};

export default PhoneNumberInput;
