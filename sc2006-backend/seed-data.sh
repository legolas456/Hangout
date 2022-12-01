echo '[SEED DATA] Initiating variables...'

secret=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJPokTl71tr0CTjmazni9TFlojwfEipIOooFEv5G2jgJ9tBAwICClk2YYj+BdlO75DXke4BjEm+ngQN1gagfBkoK5d0QdHqgDKm5RVHaGxWPNRGnX3zo/vfu74/D7qIyJDG4COpiedZNnES555iPjyb1SPXkOVao4l2bpayxAZawIDAQAB

echo '[SEED DATA] Seeding data...'

curl -X POST 'http://localhost:3100/seed-data' > /dev/null \
  -H 'Content-Type: application/json' \
  -d '{"secret": "'"$secret"'"}' \
  

seedFailed=$?

if [ $seedFailed -gt 0 ]
then
   echo '[SEED DATA] Unsuccessfully seeded data. Please check if you have started the server.'
else
   echo '[SEED DATA] Successfully seeded data.'
fi