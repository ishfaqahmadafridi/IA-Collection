import { useRegistrationForm } from '../../hooks/auth/useRegistrationForm';
import RegisterErrorAlert from './RegisterErrorAlert';
import RegisterUsernameField from './RegisterUsernameField';
import RegisterEmailField from './RegisterEmailField';
import RegisterPasswordField from './RegisterPasswordField';
import RegisterSubmitButton from './RegisterSubmitButton';

export default function RegisterFormContainer() {
    const { status, error, handleChange, handleSubmit } = useRegistrationForm();
    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <RegisterErrorAlert error={error} />
            <RegisterUsernameField onChange={handleChange} />
            <RegisterEmailField onChange={handleChange} />
            <RegisterPasswordField onChange={handleChange} />
            <RegisterSubmitButton status={status} />
        </form>
    );
}
