import { Button, createStyles, Group, Header, TextInput } from '@mantine/core';
import { IconBucket, IconSearch } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
	header: {
		paddingLeft: theme.spacing.md,
		paddingRight: theme.spacing.md,
	},

	inner: {
		height: 56,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	links: {
		[theme.fn.smallerThan('md')]: {
			display: 'none',
		},
	},

	search: {
		[theme.fn.smallerThan('xs')]: {
			display: 'none',
		},
	},

	link: {
		display: 'block',
		lineHeight: 1,
		padding: '8px 12px',
		borderRadius: theme.radius.sm,
		textDecoration: 'none',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
		fontSize: theme.fontSizes.sm,
		fontWeight: 500,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		},
	},
}));

const AppHeader = () => {
	const { classes } = useStyles();

	return (
		<Header height={56} className={classes.header} mb={120}>
			<div className={classes.inner}>
				<Group>
					{/*<Burger opened={opened} onClick={toggle} size="sm" />*/}
					<IconBucket size={32} />
				</Group>

				<Group>
					<TextInput
						className={classes.search}
						placeholder="Search"
						icon={<IconSearch size={16} stroke={1.5} />}
					/>
					<Button variant="default">Log in</Button>
					<Button>Sign up</Button>
				</Group>
			</div>
		</Header>
	);
};

export default AppHeader;
