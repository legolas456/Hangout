import { doc, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { GlobalContextProps, PageTransitionContext } from '../contexts';
import { db } from '../services';
import { DbUser, EVENT_DATETIME_FORMAT, TimeRange } from '../types';

type useUpdateUserProps = Pick<GlobalContextProps, 'me' | 'setMe'>;

/* 
	Sets up a snapshot listener on the user document, and updates notificationIds, eventIds, and friendIds of Me if the lengths differ.
	Only the above specific properties are updated since they can be updated by other users. The rest of the properties should require
	a backend call by the current user and will be set by calling setMe(<Result of making backend call>)
*/
export const useUpdateUser = ({ me, setMe }: useUpdateUserProps) => {
	const { setLoading } = useContext(PageTransitionContext);
	useEffect(() => {
		if (!me) return;

		const unsub = onSnapshot(
			doc(db, 'users', me.uuid),
			(snapshot) => {
				const data = snapshot.data() as DbUser;
				console.log('snapshot received', snapshot, snapshot.data());

				if (!snapshot.metadata.hasPendingWrites) {
					setLoading(true);
					setMe((prevMe) => {
						if (prevMe?.updatedAt === data.updatedAt) return prevMe;
						const { password, createdAt, ...rest } = data;
						return {
							uuid: prevMe!.uuid,
							...rest,
							createdAt: createdAt.toDate(),
						};
					});
					setLoading(false);
				}
			},
			(error) => {
				console.log('error listening to user doc', error.message);
			},
		);

		return () => {
			unsub && unsub();
		};
	}, [me]);
};
