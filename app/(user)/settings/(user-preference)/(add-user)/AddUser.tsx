"use client";

import {
  Controller,
  useForm,
  SubmitHandler,
  FormProvider,
} from "react-hook-form";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import FormField from "@/components/common/form/fields/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  createUser,
  editUserAdmin,
  getAllPermissions,
  getAllRoles,
  getAllUsers,
} from "@/api/services/auth.api";
import { addUserSchema } from "@/lib/validations/admin/create-user.schema";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { Loader } from "@/components/common/Loader";
import { User } from "../UserTable";
import { GlobalForm } from "@/components/common/form/GlobalForm";
import { useAuth } from "@/context/auth.context";
import { LoaderCircle } from "lucide-react";

export type AddUserFormValues = {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roleId: number;
  permissionIds?: number[];
};

export default function AddUser({
  open,
  setOpen,
  mode,
  setMode,
  selectedUser,
  setSelectedUser,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "create" | "edit";
  setMode: (mode: "create" | "edit") => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}) {
  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    mode: mode === "edit" ? "onChange" : "onSubmit",
    defaultValues: {
      email: mode === "edit" ? selectedUser?.email : "",
      firstName: mode === "edit" ? selectedUser?.firstName : "",
      lastName: mode === "edit" ? selectedUser?.lastName : "",
      phoneNumber: mode === "edit" ? selectedUser?.phoneNumber : "",
      roleId: mode === "edit" ? selectedUser?.role : 1,
      permissionIds:
        mode === "edit" ? selectedUser?.permissions?.map((p: any) => p.id) : [],
    },
  });
  // console.log("selectedUser", selectedUser)
  const { data: res = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const { user } = useAuth();

  const { data: roles = [], isLoading: isRolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });

  const { data: permissions = [], isLoading: isPermissionsLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: getAllPermissions,
  });

  // print roles and permissions
  console.log("roles", roles);
  console.log("permissions", permissions);

  // console.log(res.users)
  // const [roleId, setRoleId] = useState(1)

  // useEffect(() => {
  //     setRoleId(Number(watch("roleId")))
  // }, [watch("roleId")])
  const roleId = form.watch("roleId");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (mode === "edit" && selectedUser) {
      form.reset({
        email: selectedUser.email,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        phoneNumber: selectedUser.phoneNumber,
        roleId: selectedUser.role,
        permissionIds: selectedUser?.permissions?.map(
          (permission: any) => permission.id,
        ),
      });
    }
  }, [selectedUser]);
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpen(false);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message);
    },
  });
  const updateUserMutation = useMutation({
    mutationFn: editUserAdmin,
    onSuccess: () => {
      toast.success("User updated successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpen(false);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const onSubmit: SubmitHandler<AddUserFormValues> = (data) => {
    const payload = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      roleId: Number(data.roleId),
      permissionIds: data.permissionIds,
    };
    // console.log("payload before", payload)
    if (mode === "edit") {
      // console.log("payload after", { id: selectedUser?.id, ...payload })
      // @ts-ignore
      updateUserMutation.mutate({ id: selectedUser?.id, ...payload });
    } else {
      createUserMutation.mutate(payload);
    }
  };
  const currentUserRole = user?.user?.role?.name; // "superAdmin" | "admin" | etc.

  const filteredRoles = roles?.filter((role: any) => {
    if (currentUserRole === "superAdmin") {
      return ["superAdmin", "staff"].includes(role.name);
    }

    return ["admin", "user"].includes(role.name);
  });
  // // console.log(isValid)
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <h3 className="font-medium">Account Users</h3>
          <p className="text-sm text-muted-foreground">
            Total # of Users: {res.users.length}
          </p>
        </div>
      )}
      <Button
        onClick={() => {
          setMode("create");
          setSelectedUser(null);
          setOpen(true);
        }}
      >
        + Add New User
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Add New" : "Edit"} User
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <GlobalForm
                formWrapperClassName="flex flex-col gap-4"
                fields={[
                  {
                    name: "email",
                    label: "Email",
                    placeholder: "Enter email",
                    type: "email",
                    show: mode === "create",
                  },
                  {
                    name: "firstName",
                    label: "First Name",
                    placeholder: "Enter first name",
                    type: "text",
                  },
                  {
                    name: "lastName",
                    label: "Last Name",
                    placeholder: "Enter last name",
                    type: "text",
                  },
                  {
                    name: "phoneNumber",
                    label: "Phone Number",
                    placeholder: "Enter phone number",
                    type: "phone",
                    show: mode === "create",
                  },
                ]}
              />

              
              {isRolesLoading ? (
                <Loader />
              ) : (
                <div>
                  <label className="text-sm font-medium">User Role</label>

                  <Controller
                    name="roleId"
                    control={form.control}
                    defaultValue={
                      mode === "edit"
                        ? selectedUser?.role
                        : filteredRoles?.[0]?.id
                    }
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>

                        <SelectContent>
                          {filteredRoles?.map((role:any) => (
                            <SelectItem
                              key={role.id}
                              value={role.id.toString()}
                            >
                              {role.name.charAt(0).toUpperCase() +
                                role.name.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
              <div className="space-y-2">
                {isPermissionsLoading ? (
                  <Loader />
                ) : (
                  permissions?.map((permission: any) => (
                    <div
                      key={permission.id}
                      className="flex items-center gap-2"
                    >
                      <Controller
                        name="permissionIds"
                        control={form.control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value?.includes(permission.id)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];

                              if (checked) {
                                field.onChange([...current, permission.id]);
                              } else {
                                field.onChange(
                                  current.filter((id) => id !== permission.id),
                                );
                              }
                            }}
                          />
                        )}
                      />

                      <span className="text-sm capitalize">
                        {permission.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <DialogFooter>
                <Button
                  disabled={!form.formState.isValid}
                  type="submit"
                  className="w-full"
                >
                  {createUserMutation.isPending ?
                      <LoaderCircle className="animate-spin mr-2" size={16} />
                   : ""}
                  {mode === "create" ? "Create" : "Update"} User
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
