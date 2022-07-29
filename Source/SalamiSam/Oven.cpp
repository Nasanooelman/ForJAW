// Fill out your copyright notice in the Description page of Project Settings.


#include "Oven.h"
#include "BasicPlayer.h"
#include "CPizza.h"

// Sets default values for this component's properties
UOven::UOven()
{
	// Set this component to be initialized when the game starts, and to be ticked every frame.  You can turn these features
	// off to improve performance if you don't need them.
	PrimaryComponentTick.bCanEverTick = true;

	StoredPizza = nullptr;
	// ...
}


// Called when the game starts
void UOven::BeginPlay()
{
	Super::BeginPlay();

	// ...
	
}

const int TIME_TO_COOK = 20;
const int TIME_TO_CRISP = 30;
const int TIME_TO_BURN = 40;

float AddedDeltaTime = 0;
// Called every frame
void UOven::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

	// While we have the Pizza on us....
	if (StoredPizza != nullptr)
	{	
		// Cook it
		AddedDeltaTime += DeltaTime;
		UE_LOG(LogClass, Log, TEXT("PIZZA HAS BEEN COOKING FOR %f"), AddedDeltaTime);

		// Make sure if we've already burnt it we cant unburn it by cooking it longer
		if (AddedDeltaTime >= TIME_TO_COOK && StoredPizza->GetCooked() != "Burnt")
		{
			StoredPizza->SetCooked("Cooked");
			if (AddedDeltaTime >= TIME_TO_CRISP)
			{
				StoredPizza->SetCooked("Crispy");
				if (AddedDeltaTime >= TIME_TO_BURN)
				{
					StoredPizza->SetCooked("Burnt");
				}
			}
		}
	}
	else
	{
		// Reset this since we don't want to instantly burn a new pizza
		AddedDeltaTime = 0;
	}
	// ...
}


void UOven::OnView()
{
	APawn* Player = GetWorld()->GetFirstPlayerController()->GetPawn();
	ABasicPlayer* PlayerClass = Cast<ABasicPlayer>(Player);

	if (PlayerClass)
	{
		PlayerClass->SetFocused("PIZZA OVEN");
	}
}

void UOven::StorePizza(CPizza* Pizza)
{
	StoredPizza = Pizza;
}

// The Pizza Baser is the first part of making a pizza.
// It generates the initial object and also selects which sauce base it has.
void UOven::OnInteract()
{
	// Check if we have a Pizza already
	APawn* Player = GetWorld()->GetFirstPlayerController()->GetPawn();
	ABasicPlayer* PlayerClass = Cast<ABasicPlayer>(Player);

	if (PlayerClass)
	{
		// If they havent already got a pizza.
		if (PlayerClass->GetHeldPizza() != nullptr)
		{
			if (StoredPizza != nullptr)
			{
				UE_LOG(LogClass, Log, TEXT("I ALREADY HAVE A PIZZA"));
			}
			else
			{
				UE_LOG(LogClass, Log, TEXT("TAKEN PIZZA"));
				// Store the Pizza in this class
				StoredPizza = PlayerClass->GetHeldPizza();
				// Get rid of the Pizza our Player has.
				PlayerClass->DropPizza();
				float HowLongToCook;
				// If it's already slightly cooked accelerate the time it takes to burn it.
				FString PizzaState = StoredPizza->GetCooked();
				// Would much rather use a switch case here but C++ doesn't like strings
				if (PizzaState == "Cooked")
				{
					HowLongToCook = 20;
				}
				else if(PizzaState == "Crispy")
				{
					HowLongToCook = 30;
				}
				else
				{
					HowLongToCook = 0;
				}
		
				AddedDeltaTime = HowLongToCook;
			}
		}
		else
		{
			// No Pizza;
			// If they don't have a pizza... Do we have one?
			if (StoredPizza != nullptr)
			{
				UE_LOG(LogClass, Log, TEXT("PIZZA IS %s"), *StoredPizza->GetCooked());
				// We do!
				// Give it back to the player
				PlayerClass->ReceivePizza(StoredPizza);
				// We dont have it anymore
				StoredPizza = nullptr;
				UE_LOG(LogClass, Log, TEXT("GIVEN PIZZA"));

				
			}
		}
	}
}


