const venom = require('venom-bot');
const xlsx = require('xlsx');

venom
	.create({
		session: 'session-name',
		multidevice: true,
		headless: false, // Tarayıcı görünür olacak şekilde ayarlandı
		qrTimeout: 0,
	})
	.then((client) => start(client))
	.catch((error) => {
		console.log(error);
	});

function start(client)
{
	const groupNameList = ['KANUNİ YURDU 1', 'KANUNİ YURDU 2'];
	let i = -1;
	while(++i < groupNameList.length)
	{
		const groupName = groupNameList[i];
		client.getAllChats().then((chats) => {
		const group = chats.find((chat) => chat.name === groupName && chat.isGroup);
		if (group)
		{
			client.getGroupMembers(group.id._serialized).then((members) =>
			{
				const memberNumbers = members.map((member) =>
				{
					let number = member.id.user;
					if (number.startsWith('90'))
						number = number.slice(2);
					return number;
				});
				console.log('Group Members:', memberNumbers);
				// Üye numaralarını bir Excel dosyasına yazdırmak
				const ws = xlsx.utils.json_to_sheet(memberNumbers.map((number) => ({ Number: number })));
				const wb = xlsx.utils.book_new();
				xlsx.utils.book_append_sheet(wb, ws, 'Group Members');
				if (groupName == "KANUNİ YURDU 1")
					xlsx.writeFile(wb, 'kanuni1.xlsx');
				else if (groupName == "KANUNİ YURDU 2")
					xlsx.writeFile(wb, 'kanuni2.xlsx');

				console.log('Member numbers saved to group_members.xlsx');
			}).catch((error) => {
				console.error('Error getting group members:', error);
			});
		}
		else
			console.log(`Group '${groupName}' not found`);
		}).catch((error) =>
		{
			console.error('Error getting chats:', error);
		});
	}
}
