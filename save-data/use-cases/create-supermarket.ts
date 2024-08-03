type Input = {
    cnpj: string;
    name: string;
    address: string;
}

export class CreateSupermarket {
    public constructor(readonly supermarketRepository) { }

    public async execute({ cnpj, name, address }: Input): Promise<void> {
        const supermarketExists = this.supermarketRepository.existsByCnpnj(cnpj);
        if (supermarketExists) {
            return;
        }
        const supermarket = Supermarket.create(cnpj, name, address);
        await this.supermarketRepository.save(supermarket);
        return;
    }
}