import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { countries } from "countries-list";
import { State } from "country-state-city";
import { useSelector } from "react-redux";
import Select from "react-select";
const Checkout = forwardRef((props, ref) => {
  const { user } = useSelector((state) => state.users);
  const formMethods = useForm({
    defaultValues: {
      customerName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      customerEmail: user?.email || "",
    },
  });
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = formMethods;
  const countryOptions = Object.entries(countries).map(([code, country]) => ({
    value: code,
    label: country.name,
  }));
  const countrySelected = watch("customerCountry");
  const [stateOptions, setStateOptions] = useState([]);
  useImperativeHandle(ref,()=>({submitForm:()=>{
    return new Promise((resolve,reject)=>{
      handleSubmit((data)=>{
        resolve(data)
      },(errors)=>{
        reject(errors)
      })()
    })
  }}))

  useEffect(() => {
    if (countrySelected) {
      const states = State.getStatesOfCountry(countrySelected);
      setStateOptions(
        states.map((state) => ({ value: state.isoCode, label: state.name }))
      );
    } else {
      setStateOptions([]);
    }
  }, [countrySelected]);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(data=>console.log(data))}
        className="flex flex-col gap-4 m-2  "
      >
        <hr className=" bg-green-700 w-full h-[2px]" />
        <h1 className="text-center font-serif text-lg">Customer Details</h1>
        <div>
          <div>
            <Label
              value="Customer Name :"
              htmlFor="customerName"
              className="font-serif text-[14px] font-semibold"
            />
          </div>
          <TextInput
            type="text"
            id="customerName"
            className="font-serif"
            sizing={"sm"}
            {...register("customerName", {
              required: "Customer Name is Required",
            })}
            readOnly={!!(user?.firstName && user?.lastName)}
          />
          {errors.customerName && (
            <span className="text-red-500 font-serif text-sm">
              {errors.customerName.message}
            </span>
          )}
        </div>
        <div>
          <div>
            <Label
              value="Customer Email :"
              htmlFor="customerEmail"
              className="font-serif text-[14px] font-semibold"
            />
          </div>
          <TextInput
            type="email"
            id="customerEmail"
            className="font-serif"
            {...register("customerEmail", {
              required: "Customer Email is Required",
            })}
            readOnly={!!user?.email}
          />
          {errors.customerEmail && (
            <span className="text-red-500 font-serif text-sm">
              {errors.customerEmail.message}
            </span>
          )}
        </div>
        <div>
          <div>
            <Label
              value="Address Line 1 :"
              htmlFor="addressLine1"
              className="font-serif text-[14px] font-semibold"
            />
          </div>
          <TextInput
            type="text"
            id="addressLine1"
            className="font-serif"
            placeholder="customer address line 1..."
            {...register("addressLine1", {
              required: "Customer Address Line 1 Required",
            })}
          />
          {errors.addressLine1 && (
            <span className="text-red-500 font-serif text-sm">
              {errors.addressLine1.message}
            </span>
          )}
        </div>
        <div>
          <div>
            <Label
              value="Address Line 2 :"
              htmlFor="addressLine2"
              className="font-serif text-[14px] font-semibold"
            />
          </div>
          <TextInput
            type="text"
            id="addressLine2"
            className="font-serif"
            placeholder="customer address line 2... (optional)"
            {...register("addressLine2")}
          />
        </div>
        <div>
          <div>
            <Label
              value="Customer Country :"
              htmlFor="customerCountry"
              className="font-serif text-[14px] font-semibold"
            />
          </div>
          <Controller
            name="customerCountry"
            control={control}
            rules={{ required: "Customer Country is Required" }}
            render={({ field }) => (
              <Select
                {...field}
                id="customerCountry"
                className="font-serif"
                options={countryOptions}
                value={countryOptions.find(
                  (Option) => Option.value === field.value
                )}
                onChange={(option) => field.onChange(option.value)}
              />
            )}
          />
          {errors.customerCountry && (
            <span className="text-red-500 font-serif text-sm">
              {errors.customerCountry.message}
            </span>
          )}
        </div>
        <div>
          <div>
            <Label
              value="Customer State/Region :"
              htmlFor="customerState"
              className="font-serif text-[14px] font-semibold"
            />
          </div>
          <Controller
            name="customerState"
            control={control}
            rules={{ required: "Customer State is Required" }}
            render={({ field }) => (
              <Select
                {...field}
                id="customerState"
                options={stateOptions}
                className="font-serif"
                value={stateOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(option) => field.onChange(option.value)}
                isDisabled={!countrySelected}
              />
            )}
          />
          {errors.customerState && (
            <span className="text-red-500 font-serif text-sm">
              {errors.customerState.message}
            </span>
          )}
        </div>

        <div>
          <div>
            <Label
              value="Customer City :"
              htmlFor="customerCity"
              className="font-serif text-[14px] font-semibold"
            />
          </div>
          <TextInput
            type="text"
            id="customerCity"
            className="font-serif"
            placeholder="customer city..."
            {...register("customerCity", {
              required: "Customer City Name is Required",
            })}
          />
          {errors.customerCity && (
            <span className="text-red-500 font-serif text-sm">
              {errors.customerCity.message}
            </span>
          )}
        </div>
        <div>
          <div>
            <Label
              value="Postal Code :"
              htmlFor="postalCode"
              className="font-serif text-[14px] font-semibold"
            />
          </div>
          <TextInput
            type="number"
            id="postalCode"
            className="font-serif"
            placeholder="postal code..."
            {...register("postalCode", {
              required: "Customer Postal Code is Required",
            })}
          />
          {errors.postalCode && (
            <span className="text-red-500 font-serif text-sm">
              {errors.postalCode.message}
            </span>
          )}
        </div>
      </form>
    </FormProvider>
  );
});

export default Checkout;
