import { Body, Controller, Get, Req, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetUserDto } from './get-user.dto';
import {
	DbEvent,
	GetUserRes,
	PresentableError,
} from '../../../sc2006-common/src';
import { UpdateUserDto } from './update-user.dto';
import { EventService } from 'src/event/event.service';

@Controller('users')
export class UserController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly eventService: EventService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('/current')
	async getUserFromToken(@Req() req) {
		const jwtToken = req.cookies['jwtToken'];
		const user = await this.authService.decodeToken(jwtToken);
		return user;
	}

	@UseGuards(JwtAuthGuard)
	@Post('getOne')
	async getOne(@Body() body: GetUserDto): Promise<GetUserRes> {
		const { email } = body;
		const user = await this.userService.findOne(email);
		if (!user) {
			const presentableError: Omit<PresentableError, 'name'> = {
				message: 'User with specified email does not exist',
				title: 'User not found',
				level: 'warning',
			};
			return {
				error: presentableError,
				user: null,
			};
		}
		return { error: null, user };
	}

	@UseGuards(JwtAuthGuard)
	@Post('updateOne')
	async updateOne(
		@Body() body: UpdateUserDto,
	): Promise<{ error: null | Omit<PresentableError, 'name'> }> {
		const error = await this.userService.updateOne(body.uuid, body.user);
		const requiredUser = await this.userService.findOne(body.uuid);
		const { eventIds, address, preferences, schedule } = requiredUser;
		const events = await this.eventService.findMany(eventIds);

		// When a user updates his profile information, we update his info in all associated events too so that the correct info
		// appears in re-generate event result form for events that the user created or is a participant.
		const eventsToUpdate: { uuid: string; newEvent: Partial<DbEvent> }[] = [];
		events.forEach((event) => {
			const { participants, createdAt, ...rest } = event;
			const index = participants.findIndex((p) => p.name === requiredUser.uuid);
			const updatedParticipants = [
				...participants.slice(0, index),
				{ ...participants[index], address, preferences, schedule },
				...participants.slice(index + 1),
			];
			const updatedEvent = { ...rest, participants: updatedParticipants };
			eventsToUpdate.push({ uuid: event.uuid, newEvent: updatedEvent });
			return updatedEvent;
		});
		await this.eventService.bulkUpdate(eventsToUpdate);
		return { error };
	}
}
