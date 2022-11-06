import { openContextModal } from '@mantine/modals';

export default function openSignInModal() {
  openContextModal({
    modal: 'signin',
    title: "Let's get started",
    size: 480,
    innerProps: {},
  });
}
