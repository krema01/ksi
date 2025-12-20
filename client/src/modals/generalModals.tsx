import { CreateTimeEntryModal } from "./createTimeEntryModal";
import { CreateUserModal } from "./createUserModal";

declare module "@mantine/modals" {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}

export const modals = {
  CreateTimeEntryModal: CreateTimeEntryModal,
  CreateUserModal: CreateUserModal,
  // eventCardSettingsModal: EventCardSettingsModal,
  // userSettingsModal: UserSettingsModal,
  // calenderSettingsModal: CalenderSettingsModal,
};
