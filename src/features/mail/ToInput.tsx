import useSuggestions from "@/api/account/useSuggestions";

import { useState } from "react";
import Avatar from "react-avatar";

import Select from "react-select";
interface ToInputProps {
  label: string;
  placeholder: string;
  onChange(values: { label: string; value: string }[]): void;
  value: { label: string; value: string }[];
}
export default function SelectInput({
  label,
  placeholder,
  onChange,
  value,
}: ToInputProps) {
  const { isPendingSuggestions, suggestions } = useSuggestions();
  const [input, setValue] = useState("");
  const options =
    suggestions?.map((suggestion) =>
      createOption(suggestion.address, suggestion.name ?? "")
    ) ?? [];

  return (
    <div className="border w-full pl-2 rounded-md max-w-full flex items-center ">
      <span className=" text-sm text-gray-500 mr-1">{label}</span>
      <Select
        inputValue={input}
        onInputChange={setValue}
        isMulti
        value={value}
        //@ts-ignore
        onChange={onChange}
        placeholder={placeholder}
        className="w-full max-w-full flex-1"
        isLoading={isPendingSuggestions}
        // @ts-ignore
        options={input ? options.concat(createOption(input)) : options}
        classNames={{
          control: () => {
            return "!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:hover:bg-gray-800 dark:!bg-black !flex ";
          },
          multiValue() {
            return "dark:!bg-gray-700 !min-w-fit";
          },
          multiValueLabel() {
            return "dark:text-white dark:bg-gray-700 rounded-md";
          },

          menuList() {
            return "dark:!bg-gray-800";
          },
          valueContainer() {
            return "!flex !flex-1 w-[20px] !flex-row dark:text-white !overflow-x-auto !flex-nowrap";
          },
          input() {
            return "dark:text-white";
          },
          option() {
            return "dark:hover:!bg-gray-600 hover:!bg-gray-300  !bg-transparent";
          },
        }}
      />
    </div>
  );
}

export function createOption(address: string, name: string) {
  return {
    label: (
      <span className="flex items-center gap-2">
        <Avatar size="25" name={address} round textSizeRatio={2} />
        {address}
      </span>
    ),
    value: address,
  };
}
