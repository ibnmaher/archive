import {
  DataGrid,
  GridColDef,
  GridEventListener,
  gridClasses,
} from "@mui/x-data-grid";
import { alpha, styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { DeleteModal } from "./components/deleteModal";
import { useGetUsers } from "./api/getUsers";
import { UpdateUserModal } from "./components/updateUserModal";
import { AUTH, QUERY } from "types";
import { MoonLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { UserActivityTable } from "./userActivityTable";

interface PROPS {
  query: QUERY;
  auth: AUTH;
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setSeverity: React.Dispatch<
    React.SetStateAction<"success" | "info" | "warning" | "error">
  >;
}
export const UsersTable = ({
  auth,
  query,
  refetch,
  setMessage,
  setRefetch,
  setSeverity,
  setOpen,
}: PROPS) => {
  const [updateUserModal, setUpdateUserModal] = useState<any>(false);
  const [portal, setPortal] = useState<any>(false);
  const [deleteModal, setDeleteModal] = useState<boolean | string | number>(
    false
  );
  const mainContainer: any = document.getElementById("root");

  const { response, getUsers, error, loading } = useGetUsers(query, {
    Authorization: `Bearer ${auth.token}`,
  });
  useEffect(() => {
    getUsers();
  }, [query, refetch]);
  console.log(response);
  const ODD_OPACITY = 0.2;
  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      "&:hover, &.Mui-hovered": {
        cursor: "pointer",
      },
    },
    [`& .${gridClasses.row}.odd`]: {
      backgroundColor: theme.palette.grey[200],
      "&:hover, &.Mui-hovered": {
        cursor: "pointer",
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
        "@media (hover: none)": {
          backgroundColor: "transparent",
        },
      },
      "&.Mui-selected": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity
        ),
        "&:hover, &.Mui-hovered": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY +
              theme.palette.action.selectedOpacity +
              theme.palette.action.hoverOpacity
          ),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: alpha(
              theme.palette.primary.main,
              ODD_OPACITY + theme.palette.action.selectedOpacity
            ),
          },
        },
      },
    },
  }));

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    setPortal(params.id);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "الاسم", width: 300 },
    {
      field: "email",
      headerName: "البريد الألكتروني",
      width: 300,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "department",
      headerName: "القسم",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "activities_count",

      headerName: "النشاطات",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "type",

      headerName: "النوع",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "editButton",

      headerName: "تعديل",
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => {
        return (
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              let userInfo = response.filter(
                (user: any) => user.id === params.id
              );
              setUpdateUserModal(userInfo);
            }}
          >
            <FiEdit className="text-lg" />
          </Button>
        );
      },
    },
    {
      field: "deleteButton",

      headerName: "حذف",
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => {
        return (
          <Button
            color="warning"
            onClick={(e: any) => {
              e.stopPropagation();
              setDeleteModal(params.id);
            }}
          >
            <MdOutlineDeleteOutline className="text-lg" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="w-full flex justify-center flex-1">
      {!loading ? (
        <StripedDataGrid
          autoHeight={!portal}
          rows={response || []}
          columns={columns}
          pageSize={20}
          checkboxSelection={false}
          onRowClick={handleRowClick}
          rowsPerPageOptions={[20]}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          initialState={{
            columns: {
              columnVisibilityModel: {
                editButton: auth.type === "admin" ? true : false,
                deleteButton: auth.type === "admin" ? true : false,
              },
            },
          }}
          sx={{
            backgroundColor: "white",

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#ECE8DD",
              fontWeight: "heavy ",
              "& .odd": { backgroundColor: "red" },
            },
          }}
        />
      ) : (
        <MoonLoader color="blue" size="50" />
      )}
      {deleteModal && (
        <DeleteModal
          refetch={refetch}
          setRefetch={setRefetch}
          auth={auth}
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          setMessage={setMessage}
          setOpen={setOpen}
          setSeverity={setSeverity}
          text="هل تريد حذف المستخدم؟"
          user
        />
      )}
      {updateUserModal && (
        <UpdateUserModal
          setMessage={setMessage}
          setRefetch={setRefetch}
          setSeverity={setSeverity}
          setOpen={setOpen}
          auth={auth}
          setUpdateUserModal={setUpdateUserModal}
          userInfo={updateUserModal}
        />
      )}
      {portal && (
        <UserActivityTable
          query={query}
          auth={auth}
          refetch={refetch}
          setRefetch={setRefetch}
          setOpen={setOpen}
          setMessage={setMessage}
          setSeverity={setSeverity}
          userId={portal}
          setPortal={setPortal}
        />
      )}
    </div>
  );
};
