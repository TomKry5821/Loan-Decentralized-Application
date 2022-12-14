import {
    Text,
    Button,
    SimpleGrid,
    Card,
    CardHeader,
    Heading,
    CardBody,
    CardFooter,
    Image,
    Stack
} from '@chakra-ui/react';
import TakeCustomLoanForm from './TakeCustomLoanForm';
import { useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';

export default function LoanOptions() {
    const { takeLoan, canTakeLoan } = useContext(BlockchainContext)
    return canTakeLoan ? (
        <Stack>
            <SimpleGrid spacing={4} templateColumns='repeat(3, minmax(150px, 1fr))'>
                <Card>
                    <CardHeader>
                        <Heading size='md'> 10ETH in 24 installments with an interest rate of 10% </Heading>
                    </CardHeader>
                    <CardBody align='center'>
                        <Image
                            objectFit='cover'
                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqtxGNalqX4VVqAVINE7ociLsO_hlrG3_D8g&usqp=CAU'
                            borderRadius='lg'
                            alt='Chakra UI'
                        />
                    </CardBody>
                    <CardFooter>
                        <Button
                            onClick={() => takeLoan(10, 24, 10)}
                        >
                            Take Loan
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <Heading size='md'> 50ETH in 48 installments with an interest rate of 6%</Heading>
                    </CardHeader>
                    <CardBody align='center'>
                        <Image
                            objectFit='cover'
                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdCbxBs_2vVnTHrIniISjUaNXB31urFjWH-A&usqp=CAU'
                            borderRadius='lg'
                            alt='Chakra UI'
                        />
                    </CardBody>
                    <CardFooter>
                        <Button
                            onClick={() => takeLoan(50, 48, 6)}
                        >Take Loan</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <Heading size='md'> 100ETH in 72 installments with an interest rate of 2%</Heading>
                    </CardHeader>
                    <CardBody align='center'>
                        <Image
                            objectFit='cover'
                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOdkM533-26FceqRKVlsqpnZnjBMkJg-Es2w&usqp=CAU'
                            borderRadius='lg'
                            alt='Chakra UI'
                        />
                    </CardBody>
                    <CardFooter>
                        <Button
                            onClick={() => takeLoan(100, 72, 2)}
                        >Take Loan</Button>
                    </CardFooter>
                </Card>
            </SimpleGrid>
            <TakeCustomLoanForm />
        </Stack>
    ) : (<></>);
}