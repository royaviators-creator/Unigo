# UNIGO Rollback Procedure

## Before deployment
- Confirm previous stable deployment.
- Confirm database compatibility.
- Verify required environment variables.

## Rollback triggers
- Signup failures
- Broken homepage or forms
- API errors
- Database connectivity issues

## Rollback
1. Restore previous production deployment.
2. Verify homepage.
3. Verify signup flow.
4. Verify admin access.
5. Monitor errors for 30 minutes.
