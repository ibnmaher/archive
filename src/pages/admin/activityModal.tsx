import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FileInput } from "./components/fileInput";
import { TiDelete } from "react-icons/ti";
import { useAddActivity } from "./api/addActivity";
import { UsersInput } from "./components/usersInput";
export const ActivityModal = ({
  setActivityModal,
}: {
  setActivityModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { error, response, addActivity, loading } = useAddActivity();
  const [dateFrom, setDateFrom] = React.useState<Dayjs | null>(dayjs());
  const [dateTo, setDateTo] = React.useState<Dayjs | null>(dayjs());
  const [files, setFiles] = useState<any[]>([]);
  const [values, setValues] = useState<any>({
    activityType: "محاضرة",
    images: [],
  });
  const handleChange = (e: any, name: string) => {
    setValues((values: any) => {
      return { ...values, [name]: e.target.value };
    });
  };
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    let data = new FormData();
    Object.keys(values).map((key: string) => {
      data.append(`${key}`, values[key]);
    });

    files.map((file) => {
      data.append("images", file.image);
      data.append("privateOptin", file.private);
    });

    addActivity(data);
  };
  const handleRemoveImage = (index: number) => {
    setFiles((state: any) => {
      let newState = [...state];
      newState.splice(index, 1);

      return newState;
    });
  };

  return (
    <div className="fixed w-full h-auto bg-black bg-opacity-40 top-0 bottom-0 left-0 right-0  z-50 flex items-center justify-center cursor-pointer ">
      <form
        onSubmit={handleSubmit}
        className=" h-full  w-full bg-quan rounded-lg cursor-default flex items-center justify-center relative"
      >
        <FormControl
          fullWidth
          sx={{
            width: "60%",
            display: "flex",
            flexDirection: "column",

            gap: "16px",
          }}
        >
          <TextField
            size="small"
            id="activity-type"
            value={values.activityType}
            label="نوع النشاط"
            sx={{ backgroundColor: "white" }}
            select
            onChange={(e) => handleChange(e, "activityType")}
          >
            <MenuItem value="مناقشات طلبة الدراسات العليا">
              مناقشات طلبة الدراسات العليا
            </MenuItem>
            <MenuItem value="المحاضرات(السيمينرات)">
              المحاضرات(السيمينرات)
            </MenuItem>
            <MenuItem value="">""</MenuItem>
            <MenuItem value="">""</MenuItem>
            <MenuItem value="">""</MenuItem>
            <MenuItem value="">""</MenuItem>
            <MenuItem value="">""</MenuItem>
            <MenuItem value="">""</MenuItem>
            <MenuItem value="">""</MenuItem>
            <MenuItem value="">""</MenuItem>
            <MenuItem value="">""</MenuItem>
          </TextField>
          <TextField
            label="العنوان"
            id="activity-title"
            sx={{ backgroundColor: "white" }}
            size="small"
          />
          <div className="flex items-center w-full justify-center gap-4">
            <MobileDatePicker
              label="التاريخ من"
              inputFormat="MM/DD/YYYY"
              value={dateFrom}
              disableFuture
              onChange={(value) => {
                setDateFrom(value);
                setValues((values: any) => {
                  return {
                    ...values,
                    dateFrom: dayjs(value).format("DD/MM/YYYY"),
                  };
                });
              }}
              renderInput={(params) => (
                <TextField
                  sx={{ backgroundColor: "white", width: "100%" }}
                  size="small"
                  {...params}
                />
              )}
            />
            <MobileDatePicker
              label="التاريخ الى"
              inputFormat="MM/DD/YYYY"
              value={dateTo}
              disableFuture
              minDate={dateFrom ? dateFrom : dayjs()}
              onChange={(value) => {
                setDateTo(value);
                setValues((values: any) => {
                  return {
                    ...values,
                    dateTo: dayjs(value).format("DD/MM/YYYY"),
                  };
                });
              }}
              renderInput={(params) => (
                <TextField
                  sx={{ backgroundColor: "white", width: "100%" }}
                  size="small"
                  {...params}
                />
              )}
            />
          </div>

          <TextField
            label="القسم"
            id="department"
            sx={{ backgroundColor: "white" }}
            size="small"
            select
            onChange={(e) => handleChange(e, "department")}
          >
            <MenuItem value="علوم الحاسبات">علوم الحاسبات</MenuItem>
          </TextField>
          <UsersInput />
          <textarea
            onChange={(e) => handleChange(e, "summary")}
            placeholder="نبذة عن النشاط"
            className=" resize-none rounded-[3px] h-20 w-full py-2 px-3 border-[1.8px] border-gray-300 hover:border-black focus:border-none"
          />
          <TextField
            label="رابط المرفقات"
            id="links"
            sx={{ backgroundColor: "white" }}
            size="small"
            onChange={(e) => handleChange(e, "links")}
          />

          <FileInput setFiles={setFiles} />
          <div className="flex gap-1 w-full">
            {files.map((image, index) => {
              return (
                <div className="w-10 h-10 relative">
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: "-10px", left: "-10px" }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <TiDelete className="text-red-700" />
                  </IconButton>
                  <img src={image.url} alt="" />
                </div>
              );
            })}
          </div>
          <RadioGroup
            row
            aria-labelledby="activity-type"
            name="row-radio-buttons-group"
            onChange={(e) => handleChange(e, "location")}
          >
            <FormControlLabel
              value="نشاط خارجي"
              control={<Radio />}
              label="نشاط خارجي"
            />
            <FormControlLabel
              value="نشاط داخلي"
              control={<Radio />}
              label="نشاط داخلي"
            />
          </RadioGroup>
          <Button
            variant="contained"
            sx={{ width: "16rem", marginX: "auto", fontSize: "16px" }}
            type="submit"
          >
            رفـــــع
          </Button>
        </FormControl>
        <Button
          color="error"
          sx={{ position: "absolute", backgroundColor: "white", boxShadow: 1 }}
          className="top-4 right-4"
          onClick={() => setActivityModal(false)}
        >
          <AiOutlineClose />
        </Button>
      </form>
    </div>
  );
};
