import type { Idea } from '@prisma/client';
import { Card, Group, Title, Text, Button, Stack } from '@mantine/core';
import { formatDate } from 'utils/dates';

interface Props {
	idea: Idea;
}

const IdeaCard = (props: Props) => {
	const {
		idea: {
			title,
			description,
			postedAt,
		},
	} = props;

	return (
		<Card p="lg" radius="md">
			<Stack style={{ height: '100%' }}>
				<Stack spacing={0}>
					<Title order={3}>{title}</Title>
					<Text color="dimmed">{formatDate(postedAt, 'en')}</Text>
				</Stack>
				<Text size="sm" color="dimmed">
					{description}
				</Text>
				<Group position="right" style={{ marginTop: 'auto' }}>
					<Button color="primary" mt="sm">Vote Up</Button>
				</Group>
			</Stack>
		</Card>
	);
};

export default IdeaCard;
