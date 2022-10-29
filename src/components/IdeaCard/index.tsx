import type { Idea } from '@prisma/client';
import { Card, Group, Title, Text, Button, Stack } from '@mantine/core';
import { IconBulb } from '@tabler/icons';
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
			votes,
		},
	} = props;

	return (
		<Card p="lg" radius="md">
			<Stack style={{ height: '100%' }}>
				<Stack spacing={0}>
					<Title order={3}>{title}</Title>
					<Text color="dimmed">{formatDate(postedAt, 'en')}</Text>
				</Stack>
				<Text size="sm">
					{description}
				</Text>
				<Group position="apart" style={{ marginTop: 'auto' }} pt="sm">
					<Group></Group>
					<Group>
						<Button variant="default">Visit</Button>
						<Button color="primary" leftIcon={<IconBulb />}>Light Up ({votes})</Button>
					</Group>
				</Group>
			</Stack>
		</Card>
	);
};

export default IdeaCard;
