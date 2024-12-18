import Input from "components/Elements/Inputv2";
import React, { FC, useEffect, useState } from "react";
import { SendingServiceSettingsProps } from "../EmailSettings";
import { useAppDispatch } from "store/hooks";
import Select from "components/Elements/Selectv2";
import {
  setResendDomainsList,
  setResendSettingsPrivateApiKey,
} from "reducers/settings.reducer";
import TrashIcon from "assets/icons/TrashIcon";
import Button, { ButtonType } from "components/Elements/Buttonv2";

const ResendSettings: FC<SendingServiceSettingsProps> = ({
  formData,
  setFormData,
}) => {
  const dispatch = useAppDispatch();

  const [possibleDomains, setPossibleDomains] = useState<string[]>([]);

  const callDomains = async () => {
    if (formData.apiKey) {
      dispatch(setResendSettingsPrivateApiKey(formData.apiKey));
      const response = await dispatch(setResendDomainsList(formData.apiKey));
      if (response?.data) {
        setPossibleDomains(
          response?.data?.map((item: { name: string }) => item.name) || []
        );
      }
    }
  };

  useEffect(() => {
    callDomains();
  }, [formData.apiKey]);
  return (
    <>
      <div className="flex flex-col gap-[5px]">
        <div>Resend API Key</div>
        <Input
          id="resend-api-key-input"
          wrapperClassName="!w-full"
          className="w-full"
          value={formData.apiKey}
          onChange={(value) => setFormData({ ...formData, apiKey: value })}
          type="password"
          placeholder="API Key"
        />
      </div>

      <div className="flex flex-col gap-[5px]">
        <div>Webhook Signing Secret</div>
        <Input
          id="resend-api-key-input"
          wrapperClassName="!w-full"
          className="w-full"
          value={formData.signingSecret}
          onChange={(value) =>
            setFormData({ ...formData, signingSecret: value })
          }
          type="password"
          placeholder="Signing Secret"
        />
      </div>

      <div className="flex flex-col gap-[5px]">
        <div>Domain</div>
        <Select
          id="resend-domain-select"
          options={possibleDomains.map((domain) => ({
            key: domain,
            title: domain,
          }))}
          value={formData.sendingDomain}
          onChange={(value) =>
            setFormData({ ...formData, sendingDomain: value })
          }
          placeholder="Email domain"
        />
      </div>

      {formData.sendingOptions.map((option, i) => (
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col gap-[5px] w-full">
            <div>Sending email</div>
            <Input
              id="mailgun-sending-email"
              //pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" // Regular expression for email validation
              //title="Please enter a valid email address."
              //type="email" // Specifies that the input should be treated as an email address
              wrapperClassName="!w-full"
              className="w-full"
              value={option.sendingEmail}
              onChange={(value) => {
                formData.sendingOptions[i].sendingEmail = value;
                setFormData({ ...formData });
              }}
              placeholder="example@email.com"
            />
          </div>

          <div className="flex flex-col gap-[5px] w-full">
            <div>Sending name</div>
            <Input
              id="mailgun-sending-email"
              wrapperClassName="!w-full"
              className="w-full"
              value={option.sendingName || ""}
              onChange={(value) => {
                formData.sendingOptions[i].sendingName = value;
                setFormData({ ...formData });
              }}
              placeholder="Sending email"
            />
          </div>

          <div
            className="cursor-pointer"
            onClick={() => {
              formData.sendingOptions.splice(i, 1);
              setFormData({ ...formData });
            }}
          >
            <TrashIcon />
          </div>
        </div>
      ))}

      <Button
        type={ButtonType.SECONDARY}
        onClick={() =>
          setFormData({
            ...formData,
            sendingOptions: [
              ...formData.sendingOptions,
              { sendingEmail: "", sendingName: "" },
            ],
          })
        }
      >
        Add sending option
      </Button>
    </>
  );
};

export default ResendSettings;
